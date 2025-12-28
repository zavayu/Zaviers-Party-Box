import { useEffect, useRef, useState } from 'react'
import { useWebSocket } from './useWebSocket'

export function useOnlineGame(gameType) {
  // Common online game state
  const [gamePhase, setGamePhase] = useState('createJoinRoom')
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [players, setPlayers] = useState([])
  const [clientId, setClientId] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [gameState, setGameState] = useState({})
  
  // Generate or retrieve persistent player ID
  const [persistentPlayerId] = useState(() => {
    let playerId = localStorage.getItem('partybox-player-id')
    if (!playerId) {
      // Fallback for browsers that don't support crypto.randomUUID()
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        playerId = crypto.randomUUID()
      } else {
        // Simple fallback UUID generator
        playerId = 'player-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      }
      localStorage.setItem('partybox-player-id', playerId)
      console.log('Generated new persistent player ID:', playerId)
    } else {
      console.log('Using existing persistent player ID:', playerId)
    }
    return playerId
  })
  
  const clientIdRef = useRef(null)
  const { connectionStatus, error: wsError, connect, disconnect, sendMessage, onMessage, clearError, isConnected } = useWebSocket()

  // Auto-connect when component mounts, but only after message handlers are ready
  useEffect(() => {
    console.log('[GAME] Auto-connect effect triggered:', { gamePhase, connectionStatus })
    
    if (gamePhase === 'createJoinRoom' && connectionStatus === 'disconnected') {
      // Check if we have stored room info for reconnection
      const storedRoomCode = localStorage.getItem('partybox-room-code')
      const storedPlayerName = localStorage.getItem('partybox-player-name')
      
      console.log('[GAME] Auto-connect check:', { storedRoomCode, storedPlayerName, persistentPlayerId })
      
      if (storedRoomCode && storedPlayerName && storedPlayerName.trim()) {
        console.log('[GAME] Found stored room info, will attempt reconnection after connection')
        setRoomCode(storedRoomCode)
        setPlayerName(storedPlayerName.trim())
      } else if (storedRoomCode || storedPlayerName) {
        console.log('[GAME] Incomplete stored room info, clearing localStorage')
        localStorage.removeItem('partybox-room-code')
        localStorage.removeItem('partybox-player-name')
      }
      
      // Clear any previous errors before attempting to connect
      console.log('[GAME] Clearing errors and attempting to connect...')
      clearError()
      
      // Add a small delay to avoid React Strict Mode double-execution issues
      const timer = setTimeout(() => {
        console.log('[GAME] Calling connect() function...')
        connect()
        console.log('[GAME] connect() function called')
      }, 50)
      
      return () => clearTimeout(timer)
    } else {
      console.log('[GAME] Auto-connect conditions not met:', { 
        gamePhaseMatch: gamePhase === 'createJoinRoom',
        connectionStatusMatch: connectionStatus === 'disconnected'
      })
    }
  }, [gamePhase, connectionStatus, connect, clearError, persistentPlayerId])

  // Set up message handlers immediately when the hook is initialized
  useEffect(() => {
    console.log('[GAME] Setting up message handlers...')

    const cleanupConnected = onMessage('connected', (message) => {
      console.log('[GAME] WebSocket connected message received, clientId:', message.clientId)
      setClientId(message.clientId)
      clientIdRef.current = message.clientId
      
      // Try to reconnect to existing room if we have stored info
      const storedRoomCode = localStorage.getItem('partybox-room-code')
      const storedPlayerName = localStorage.getItem('partybox-player-name')
      
      console.log('[GAME] Checking for reconnection after connected:', { storedRoomCode, storedPlayerName, persistentPlayerId })
      
      if (storedRoomCode && storedPlayerName && storedPlayerName.trim()) {
        console.log('[GAME] Attempting to reconnect to room:', storedRoomCode, 'as:', storedPlayerName)
        
        // Add a small delay to ensure the WebSocket is fully ready
        setTimeout(() => {
          console.log('[GAME] Sending reconnection message...')
          sendMessage({
            type: 'reconnectToRoom',
            roomCode: storedRoomCode,
            playerName: storedPlayerName,
            persistentPlayerId: persistentPlayerId
          })
        }, 100)
      } else {
        console.log('[GAME] No valid stored room info for reconnection')
      }
    })

    const cleanupRoomCreated = onMessage('roomCreated', (message) => {
      console.log('Room created message received:', message)
      setRoomCode(message.roomCode)
      setPlayers(message.roomState.players)
      setGamePhase('lobby')
      setIsHost(true)
      
      // Store room info for reconnection - get player name from the current player
      const currentId = clientIdRef.current || clientId
      console.log('Looking for current player with ID:', currentId, 'in players:', message.roomState.players)
      let currentPlayer = message.roomState.players.find(p => p.id === currentId)
      
      // Fallback: if we can't find by clientId, assume the host is the current player (for room creation)
      if (!currentPlayer && message.roomState.players.length === 1) {
        currentPlayer = message.roomState.players[0]
        console.log('Using fallback: assuming single player is current player:', currentPlayer)
      }
      
      if (currentPlayer && currentPlayer.name && currentPlayer.name.trim()) {
        localStorage.setItem('partybox-room-code', message.roomCode)
        localStorage.setItem('partybox-player-name', currentPlayer.name.trim())
        console.log('Stored room info for reconnection:', message.roomCode, currentPlayer.name.trim())
      } else {
        console.log('Could not find current player or player name is empty, not storing room info')
      }
    })

    const cleanupRoomJoined = onMessage('roomJoined', (message) => {
      console.log('Room joined message received:', message)
      setPlayers(message.roomState.players)
      setGamePhase(message.roomState.gamePhase || 'lobby')
      const currentId = clientIdRef.current || clientId
      if (currentId) {
        const currentPlayer = message.roomState.players.find(p => p.id === currentId)
        setIsHost(currentPlayer?.isHost || false)
        
        // Store room info for reconnection
        if (currentPlayer && currentPlayer.name && currentPlayer.name.trim()) {
          localStorage.setItem('partybox-room-code', message.roomState.code)
          localStorage.setItem('partybox-player-name', currentPlayer.name.trim())
          console.log('Stored room info for reconnection:', message.roomState.code, currentPlayer.name.trim())
        } else {
          console.log('Could not find current player or player name is empty, not storing room info')
        }
      }
    })

    const cleanupReconnected = onMessage('reconnected', (message) => {
      console.log('Successfully reconnected to room:', message.roomState.code)
      setRoomCode(message.roomState.code)
      setPlayers(message.roomState.players)
      setGamePhase(message.roomState.gamePhase)
      if (message.roomState.gameState) {
        setGameState(message.roomState.gameState)
      }
      
      // Update host status
      const currentId = clientIdRef.current || clientId
      if (currentId) {
        const currentPlayer = message.roomState.players.find(p => p.id === currentId)
        setIsHost(currentPlayer?.isHost || false)
      }
    })

    const cleanupPlayerReconnected = onMessage('playerReconnected', (message) => {
      console.log('Player reconnected:', message.player.name)
      setPlayers(message.roomState.players)
      if (message.roomState.gameState) {
        setGameState(message.roomState.gameState)
      }
    })

    const cleanupPlayerDisconnected = onMessage('playerDisconnected', (message) => {
      console.log('Player disconnected:', message.playerId)
      setPlayers(message.roomState.players)
    })

    const cleanupPlayerJoined = onMessage('playerJoined', (message) => {
      setPlayers(message.roomState.players)
      updateHostStatus(message.roomState.players)
    })

    const cleanupPlayerLeft = onMessage('playerLeft', (message) => {
      setPlayers(message.roomState.players)
      updateHostStatus(message.roomState.players)
    })

    const cleanupGameStateUpdate = onMessage('gameStateUpdate', (message) => {
      setPlayers(message.roomState.players)
      setGamePhase(message.roomState.gamePhase)
      updateHostStatus(message.roomState.players)
      
      if (message.roomState.gameState) {
        setGameState(message.roomState.gameState)
      }
    })

    const cleanupError = onMessage('error', (message) => {
      console.error('Server error:', message.message)
      // Don't override connection errors with server errors
      if (connectionStatus === 'connected') {
        // This is a server-side error, not a connection error
        console.error('Game error:', message.message)
      }
    })

    return () => {
      cleanupConnected()
      cleanupRoomCreated()
      cleanupRoomJoined()
      cleanupReconnected()
      cleanupPlayerReconnected()
      cleanupPlayerDisconnected()
      cleanupPlayerJoined()
      cleanupPlayerLeft()
      cleanupGameStateUpdate()
      cleanupError()
    }
  }, [onMessage, clientId, sendMessage, persistentPlayerId])

  const updateHostStatus = (playersList) => {
    const currentId = clientIdRef.current || clientId
    if (currentId && playersList.length > 0) {
      const currentPlayer = playersList.find(p => p.id === currentId)
      setIsHost(currentPlayer?.isHost || false)
    }
  }

  // Common actions
  const createRoom = (name) => {
    if (!isConnected || !name?.trim()) return
    setPlayerName(name.trim())
    sendMessage({
      type: 'createRoom',
      gameType,
      playerName: name.trim(),
      persistentPlayerId: persistentPlayerId
    })
  }

  const joinRoom = (code, name) => {
    if (!isConnected || !code?.trim() || !name?.trim()) return
    setRoomCode(code.trim().toUpperCase())
    setPlayerName(name.trim())
    sendMessage({
      type: 'joinRoom',
      roomCode: code.trim().toUpperCase(),
      playerName: name.trim(),
      persistentPlayerId: persistentPlayerId
    })
  }

  const leaveRoom = () => {
    if (!isConnected) return
    sendMessage({ type: 'leaveRoom' })
    
    // Clear stored room info
    localStorage.removeItem('partybox-room-code')
    localStorage.removeItem('partybox-player-name')
  }

  const updateGameSettings = (settings) => {
    if (!isConnected || !isHost) return
    sendMessage({ 
      type: 'updateGameSettings', 
      settings 
    })
  }

  const startGame = () => {
    if (!isConnected || !isHost) return
    sendMessage({ type: 'startGame' })
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (roomCode && isConnected) {
        sendMessage({ type: 'leaveRoom' })
      }
      disconnect()
    }
  }, [])

  return {
    // State
    gamePhase,
    roomCode,
    setRoomCode,
    playerName,
    setPlayerName,
    players,
    clientId,
    isHost,
    gameState,
    setGameState,
    
    // Connection
    connectionStatus,
    wsError,
    isConnected,
    
    // Actions
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    updateGameSettings,
    sendMessage,
    onMessage,
    clearError,
    
    // Refs
    clientIdRef
  }
}