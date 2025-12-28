import { WebSocketServer } from 'ws'
import http from 'http'
import crypto from 'crypto'
import { createMessageHandler } from './handlers/messageHandler.js'

// Simple UUID v4 generator (or use uuid package)
function uuidv4() {
  return crypto.randomUUID()
}

const PORT = process.env.PORT || 8080

// Create HTTP server for health checks
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }))
    return
  }
  
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not Found')
})

// Create WebSocket server using the HTTP server
const wss = new WebSocketServer({ server })

// Room state management
const rooms = new Map() // roomCode -> Room
const clients = new Map() // clientId -> Client

class Client {
  constructor(ws, clientId) {
    this.ws = ws
    this.id = clientId
    this.roomCode = null
    this.playerName = null
  }
}

// Broadcast to all clients in a room
function broadcastToRoom(roomCode, message, excludeClientId = null) {
  const room = rooms.get(roomCode)
  if (!room) return

  room.players.forEach((player, playerId) => {
    const client = clients.get(playerId)
    if (client && client.ws.readyState === 1 && client.id !== excludeClientId) {
      client.ws.send(JSON.stringify(message))
    }
  })
}

function sendMessage(clientId, message) {
  const client = clients.get(clientId)
  if (client && client.ws.readyState === 1) {
    client.ws.send(JSON.stringify(message))
  }
}

function sendError(clientId, errorMessage) {
  sendMessage(clientId, {
    type: 'error',
    message: errorMessage
  })
}

// Create message handler with dependencies
const handleMessage = createMessageHandler(rooms, clients, broadcastToRoom, sendMessage, sendError)

function handleDisconnect(clientId) {
  console.log(`Client ${clientId} disconnected`)
  const client = clients.get(clientId)
  if (client && client.roomCode) {
    const room = rooms.get(client.roomCode)
    if (room) {
      console.log(`Marking player ${clientId} as disconnected in room ${client.roomCode}`)
      // Mark player as disconnected instead of removing them immediately
      room.disconnectPlayer(clientId)
      
      // Notify other players about disconnection
      broadcastToRoom(client.roomCode, {
        type: 'playerDisconnected',
        playerId: clientId,
        roomState: room.getRoomState()
      }, clientId)
      
      // Set a timeout to remove the player if they don't reconnect
      setTimeout(() => {
        const currentRoom = rooms.get(client.roomCode)
        if (currentRoom) {
          const player = currentRoom.players.get(clientId)
          if (player && !player.isConnected) {
            console.log(`Removing player ${clientId} after timeout`)
            // Player didn't reconnect, remove them
            currentRoom.removePlayer(clientId)
            
            // Notify remaining players
            broadcastToRoom(client.roomCode, {
              type: 'playerLeft',
              playerId: clientId,
              roomState: currentRoom.getRoomState()
            })
            
            // Clean up empty rooms
            if (currentRoom.isEmpty()) {
              rooms.delete(client.roomCode)
              console.log(`Room deleted: ${client.roomCode}`)
            }
          }
        }
      }, 30000) // 30 second grace period for reconnection
    }
  }
  clients.delete(clientId)
}

// Handle WebSocket connection
wss.on('connection', (ws) => {
  const clientId = uuidv4()
  const client = new Client(ws, clientId)
  clients.set(clientId, client)

  console.log(`Client connected: ${clientId}`)

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString())
      handleMessage(clientId, message)
    } catch (error) {
      console.error('Error parsing message:', error)
      sendError(clientId, 'Invalid message format')
    }
  })

  // Handle disconnect
  ws.on('close', () => {
    console.log(`Client disconnected: ${clientId}`)
    handleDisconnect(clientId)
  })

  // Handle errors
  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${clientId}:`, error)
  })

  // Send connection confirmation
  sendMessage(clientId, { type: 'connected', clientId })
})

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`WebSocket server ready for connections`)
})