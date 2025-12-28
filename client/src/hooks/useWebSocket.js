import { useEffect, useRef, useState, useCallback } from 'react'

// Determine WebSocket URL based on environment
const getWebSocketURL = () => {
  // If explicitly set via environment variable, use that
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL
  }
  
  // In production, construct WebSocket URL from current location
  if (import.meta.env.PROD) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.hostname
    const port = window.location.port ? `:${window.location.port}` : ''
    return `${protocol}//${host}${port}`
  }
  
  // Development fallback
  return 'ws://localhost:8080'
}

const WS_URL = getWebSocketURL()

export function useWebSocket() {
  const [connectionStatus, setConnectionStatus] = useState('disconnected') // disconnected, connecting, connected
  const [error, setError] = useState(null)
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)
  const messageHandlersRef = useRef(new Map())

  const MAX_RECONNECT_ATTEMPTS = 5
  const RECONNECT_DELAY = 3000 // 3 seconds

  const connect = useCallback(() => {
    console.log('[WS] connect() called, current state:', { 
      readyState: wsRef.current?.readyState, 
      connectionStatus,
      wsRefExists: !!wsRef.current
    })
    
    // Don't try to connect if already connecting or connected
    if (wsRef.current?.readyState === WebSocket.CONNECTING || wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('[WS] Already connecting or connected, skipping')
      return
    }

    // Clean up any existing connection
    if (wsRef.current) {
      console.log('[WS] Cleaning up existing connection')
      wsRef.current.close()
      wsRef.current = null
    }

    console.log('[WS] Setting connection status to connecting...')
    setConnectionStatus('connecting')
    setError(null)

    try {
      console.log('[WS] Creating new WebSocket connection to:', WS_URL)
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('[WS] WebSocket onopen event fired')
        setConnectionStatus('connected')
        setError(null) // Clear any previous errors
        reconnectAttemptsRef.current = 0
      }

      ws.onmessage = (event) => {
        console.log('[WS] WebSocket message received:', event.data)
        try {
          const message = JSON.parse(event.data)
          
          // Call all registered handlers for this message type
          const handlers = messageHandlersRef.current.get(message.type) || []
          console.log('[WS] Calling', handlers.length, 'handlers for message type:', message.type)
          handlers.forEach(handler => handler(message))
        } catch (err) {
          console.error('[WS] Error parsing WebSocket message:', err)
        }
      }

      ws.onerror = (event) => {
        console.error('[WS] WebSocket error event:', event)
        // Only set error if we're not already connected (to avoid showing errors for successful connections)
        if (wsRef.current?.readyState !== WebSocket.OPEN) {
          setError('Connection error occurred')
        }
      }

      ws.onclose = (event) => {
        console.log('[WS] WebSocket onclose event:', event.code, event.reason)
        setConnectionStatus('disconnected')

        // Only attempt to reconnect if it was an unexpected close and we haven't exceeded max attempts
        if (event.code !== 1000 && event.code !== 1001 && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current += 1
          setError(`Connection lost. Reconnecting... (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`)
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`[WS] Reconnecting... (attempt ${reconnectAttemptsRef.current})`)
            connect()
          }, RECONNECT_DELAY)
        } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          setError('Failed to reconnect. Please refresh the page.')
        }
      }
      
      console.log('[WS] WebSocket created, waiting for connection...')
    } catch (err) {
      console.error('[WS] Error creating WebSocket:', err)
      setError('Failed to connect to server')
      setConnectionStatus('disconnected')
    }
  }, [connectionStatus])

  const disconnect = useCallback(() => {
    // Clear any reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    // Close the WebSocket connection cleanly
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      wsRef.current.close(1000, 'Client disconnecting')
    }
    wsRef.current = null

    setConnectionStatus('disconnected')
    setError(null) // Clear errors on manual disconnect
    reconnectAttemptsRef.current = 0
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
      return true
    } else {
      console.warn('WebSocket not connected, cannot send message:', message)
      setError('Not connected to server')
      return false
    }
  }, [])

  const onMessage = useCallback((messageType, handler) => {
    if (!messageHandlersRef.current.has(messageType)) {
      messageHandlersRef.current.set(messageType, [])
    }
    messageHandlersRef.current.get(messageType).push(handler)

    // Return cleanup function
    return () => {
      const handlers = messageHandlersRef.current.get(messageType) || []
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
      messageHandlersRef.current.clear()
    }
  }, [disconnect])

  return {
    connectionStatus,
    error,
    connect,
    disconnect,
    sendMessage,
    onMessage,
    clearError,
    isConnected: connectionStatus === 'connected'
  }
}

