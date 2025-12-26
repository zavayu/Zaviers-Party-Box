import { useState, useEffect, useRef } from 'react'
import { WORD_HUNT_DICTIONARY } from '../game-data/wordHuntData'

// Letter distribution similar to Scrabble for balanced gameplay
const LETTER_POOL = 'AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ'

const generateBoard = () => {
  const board = []
  for (let i = 0; i < 16; i++) {
    board.push(LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)])
  }
  return board
}

const getAdjacentIndices = (index) => {
  const row = Math.floor(index / 4)
  const col = index % 4
  const adjacent = []
  
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < 4 && c >= 0 && c < 4) {
        const adjIndex = r * 4 + c
        if (adjIndex !== index) adjacent.push(adjIndex)
      }
    }
  }
  
  return adjacent
}

const calculateScore = (wordLength) => {
  if (wordLength === 3) return 100
  if (wordLength === 4) return 400
  if (wordLength === 5) return 800
  if (wordLength === 6) return 1400
  if (wordLength === 7) return 1800
  return 2000 + (wordLength - 8) * 400
}

// Build a Trie for fast prefix checking
const buildTrie = () => {
  const trie = {}
  for (const word of WORD_HUNT_DICTIONARY) {
    let node = trie
    for (const char of word.toLowerCase()) {
      if (!node[char]) node[char] = {}
      node = node[char]
    }
    node.isWord = true
  }
  return trie
}

const findAllPossibleWords = (board) => {
  const possibleWords = new Set()
  const trie = buildTrie()
  
  // Helper function to recursively search for words starting from a position
  const searchFromPosition = (index, visited, currentWord, trieNode) => {
    const char = board[index].toLowerCase()
    
    // If this prefix doesn't exist in trie, stop searching this path
    if (!trieNode[char]) return
    
    const nextNode = trieNode[char]
    const newWord = currentWord + board[index]
    
    // Check if current word is valid (3+ letters and is a complete word)
    if (newWord.length >= 3 && nextNode.isWord) {
      possibleWords.add(newWord.toLowerCase())
    }
    
    // Stop if we've reached max length (8 letters)
    if (newWord.length >= 8) return
    
    // Try extending the word to adjacent tiles
    const adjacent = getAdjacentIndices(index)
    for (const nextIndex of adjacent) {
      if (!visited.has(nextIndex)) {
        visited.add(nextIndex)
        searchFromPosition(nextIndex, visited, newWord, nextNode)
        visited.delete(nextIndex)
      }
    }
  }
  
  // Start search from each position on the board
  for (let i = 0; i < board.length; i++) {
    const visited = new Set([i])
    searchFromPosition(i, visited, '', trie)
  }
  
  return Array.from(possibleWords)
}

// Find the path for a specific word on the board
const findPathForWord = (board, targetWord) => {
  const target = targetWord.toLowerCase()
  
  const searchFromPosition = (index, visited, currentWord, path) => {
    const char = board[index].toLowerCase()
    const newWord = currentWord + char
    const newPath = [...path, index]
    
    // Check if we've formed the target word
    if (newWord === target) {
      return newPath
    }
    
    // If current word is longer than target or doesn't match prefix, stop
    if (newWord.length >= target.length || !target.startsWith(newWord)) {
      return null
    }
    
    // Try extending to adjacent tiles
    const adjacent = getAdjacentIndices(index)
    for (const nextIndex of adjacent) {
      if (!visited.has(nextIndex)) {
        visited.add(nextIndex)
        const result = searchFromPosition(nextIndex, visited, newWord, newPath)
        if (result) return result
        visited.delete(nextIndex)
      }
    }
    
    return null
  }
  
  // Try starting from each position
  for (let i = 0; i < board.length; i++) {
    const visited = new Set([i])
    const result = searchFromPosition(i, visited, '', [])
    if (result) return result
  }
  
  return []
}

export default function WordHuntGame({ onBack }) {
  const [gamePhase, setGamePhase] = useState('home') // home, playing, finished
  const [board, setBoard] = useState([])
  const [selectedPath, setSelectedPath] = useState([])
  const [foundWords, setFoundWords] = useState(new Set())
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(80)
  const [isDragging, setIsDragging] = useState(false)
  const [wordFeedback, setWordFeedback] = useState(null) // { word, status, points, message }
  const [allPossibleWords, setAllPossibleWords] = useState([])
  const [isCalculatingWords, setIsCalculatingWords] = useState(false)
  const [showWordPath, setShowWordPath] = useState(null) // { word, path }
  
  const timerRef = useRef(null)
  const boardRef = useRef(null)

  // Start game
  const startGame = () => {
    const newBoard = generateBoard()
    setBoard(newBoard)
    setSelectedPath([])
    setFoundWords(new Set())
    setScore(0)
    setTimeRemaining(80)
    setGamePhase('playing')
    setWordFeedback(null)
  }

  // Timer
  useEffect(() => {
    if (gamePhase === 'playing' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setGamePhase('finished')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gamePhase, timeRemaining])

  // Calculate all possible words when game finishes
  useEffect(() => {
    if (gamePhase === 'finished' && board.length > 0) {
      setIsCalculatingWords(true)
      // Use setTimeout to allow UI to update with loading state
      setTimeout(() => {
        const possibleWords = findAllPossibleWords(board)
        setAllPossibleWords(possibleWords.sort((a, b) => b.length - a.length))
        setIsCalculatingWords(false)
      }, 100)
    }
  }, [gamePhase, board])

  // Handle pointer down
  const handlePointerDown = (e, index) => {
    e.preventDefault()
    setIsDragging(true)
    setSelectedPath([index])
    setWordFeedback(null)
  }

  // Handle pointer move
  const handlePointerMove = (e) => {
    if (!isDragging || !boardRef.current) return
    
    const tiles = boardRef.current.querySelectorAll('[data-tile-index]')
    const point = { x: e.clientX, y: e.clientY }
    const lastIndex = selectedPath[selectedPath.length - 1]
    const adjacentIndices = getAdjacentIndices(lastIndex)
    
    let selectedIndex = null
    const bufferPercent = 0.15 // 15% buffer on each edge
    
    // First pass: check if pointer is directly over any tile (with buffer)
    for (const tile of tiles) {
      const rect = tile.getBoundingClientRect()
      const bufferX = rect.width * bufferPercent
      const bufferY = rect.height * bufferPercent
      
      // Check if pointer is within buffered bounds
      if (
        point.x >= rect.left + bufferX &&
        point.x <= rect.right - bufferX &&
        point.y >= rect.top + bufferY &&
        point.y <= rect.bottom - bufferY
      ) {
        const index = parseInt(tile.dataset.tileIndex)
        if (!selectedPath.includes(index) && adjacentIndices.includes(index)) {
          selectedIndex = index
          break
        }
      }
    }
    
    // Second pass: if not over a tile center, find closest adjacent tile within threshold
    if (selectedIndex === null) {
      let minDistance = Infinity
      const threshold = 50 // pixels - adjust for sensitivity
      
      for (const tile of tiles) {
        const index = parseInt(tile.dataset.tileIndex)
        
        // Only consider adjacent tiles not yet in path
        if (selectedPath.includes(index) || !adjacentIndices.includes(index)) continue
        
        const rect = tile.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const distance = Math.sqrt(
          Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)
        )
        
        if (distance < minDistance && distance < threshold) {
          minDistance = distance
          selectedIndex = index
        }
      }
    }
    
    // Add tile if found
    if (selectedIndex !== null) {
      setSelectedPath(prev => [...prev, selectedIndex])
      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(10)
    }
  }

  // Handle pointer up
  const handlePointerUp = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    if (selectedPath.length >= 3) {
      const word = selectedPath.map(i => board[i]).join('')
      submitWord(word)
    }
    
    setSelectedPath([])
  }

  // Submit word
  const submitWord = (word) => {
    const lowerWord = word.toLowerCase()
    
    // Check if already found
    if (foundWords.has(lowerWord)) {
      setWordFeedback({ word, status: 'duplicate', message: 'Already used' })
      setTimeout(() => setWordFeedback(null), 1500)
      return
    }
    
    // Check if valid dictionary word
    if (WORD_HUNT_DICTIONARY.has(lowerWord)) {
      const points = calculateScore(word.length)
      setFoundWords(prev => new Set([...prev, lowerWord]))
      setScore(prev => prev + points)
      setWordFeedback({ word, status: 'valid', points })
      setTimeout(() => setWordFeedback(null), 1500)
    } else {
      setWordFeedback({ word, status: 'invalid', message: 'Not a word' })
      setTimeout(() => setWordFeedback(null), 1500)
    }
  }

  // Get tile center position for line drawing
  const getTileCenter = (index) => {
    const row = Math.floor(index / 4)
    const col = index % 4
    return {
      x: col * 100 + 50, // assuming 100% width divided by 4
      y: row * 100 + 50
    }
  }

  if (gamePhase === 'home') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6 text-center">
          <button
            onClick={onBack}
            className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>

          <div>
            <h1 className="text-5xl font-black text-white mb-2">Word Hunt</h1>
            <p className="text-gray-400">Swipe to form words!</p>
          </div>

          <div className="space-y-3 text-left">
            <div className="bg-gray-800 rounded-lg p-4 text-sm text-white">
              <p className="font-semibold mb-2">📝 How to Play</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Swipe across adjacent letters to form words</li>
                <li>• Words must be 3+ letters</li>
                <li>• Can't reuse tiles in the same word</li>
                <li>• Longer words = more points</li>
              </ul>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-sm text-white">
              <p className="font-semibold mb-2">⏱️ Time Limit</p>
              <p className="text-gray-300">80 seconds to find as many words as you can!</p>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors text-lg"
          >
            Start Game
          </button>
        </div>
      </div>
    )
  }

  if (gamePhase === 'finished') {
    const sortedWords = Array.from(foundWords).sort((a, b) => b.length - a.length)
    const missedWords = allPossibleWords.filter(word => !foundWords.has(word))
    const maxPossibleScore = allPossibleWords.reduce((sum, word) => sum + calculateScore(word.length), 0)
    
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6 text-center">
          <button
            onClick={onBack}
            className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>

          <div>
            <p className="text-5xl mb-4">🎉</p>
            <h1 className="text-4xl font-black text-white mb-2">Game Over!</h1>
          </div>

          {isCalculatingWords ? (
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-400">Calculating all possible words...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gray-800 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Final Score</p>
                  <p className="text-5xl font-black text-white">{score.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs mt-1">Max possible: {maxPossibleScore.toLocaleString()}</p>
                </div>
            
            <div>
              <p className="text-gray-400 text-sm">Words Found</p>
              <p className="text-3xl font-bold text-blue-400">{foundWords.size} / {allPossibleWords.length}</p>
            </div>
          </div>

          {sortedWords.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 max-h-64 overflow-y-auto">
              <p className="text-gray-400 text-sm mb-3 text-left">Your Words</p>
              <div className="flex flex-wrap gap-2">
                {sortedWords.map(word => (
                  <span
                    key={word}
                    className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm font-medium"
                  >
                    {word.toUpperCase()} <span className="text-gray-400">+{calculateScore(word.length)}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {missedWords.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 max-h-64 overflow-y-auto">
              <p className="text-gray-400 text-sm mb-3 text-left">Missed Words ({missedWords.length}) - Click to see path</p>
              <div className="flex flex-wrap gap-2">
                {missedWords.map(word => (
                  <button
                    key={word}
                    onClick={() => {
                      const path = findPathForWord(board, word)
                      setShowWordPath({ word, path })
                    }}
                    className="px-3 py-1 bg-gray-700 text-gray-400 rounded-full text-sm hover:bg-gray-600 hover:text-gray-200 transition-colors cursor-pointer"
                  >
                    {word.toUpperCase()} <span className="text-gray-500">+{calculateScore(word.length)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
            </>
          )}

          <button
            onClick={startGame}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors text-lg"
          >
            Play Again
          </button>
        </div>

        {/* Word Path Modal */}
        {showWordPath && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-6 z-50"
            onClick={() => setShowWordPath(null)}
          >
            <div 
              className="bg-gray-800 rounded-2xl p-6 max-w-md w-full space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">
                  {showWordPath.word.toUpperCase()}
                  <span className="text-gray-400 text-lg ml-2">
                    +{calculateScore(showWordPath.word.length)}
                  </span>
                </h3>
                <button
                  onClick={() => setShowWordPath(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Board Preview */}
              <div className="relative w-full aspect-square bg-gray-900 rounded-xl p-2">
                <div className="grid grid-cols-4 gap-1 h-full">
                  {board.map((letter, index) => {
                    const isInPath = showWordPath.path.includes(index)
                    const pathIndex = showWordPath.path.indexOf(index)
                    
                    return (
                      <div
                        key={index}
                        className={`
                          relative flex items-center justify-center rounded-lg font-black text-2xl
                          transition-all
                          ${isInPath 
                            ? 'bg-green-600 text-white scale-105 shadow-lg' 
                            : 'bg-gray-700 text-gray-500'
                          }
                        `}
                      >
                        {letter}
                        {isInPath && (
                          <span className="absolute top-0.5 right-0.5 text-xs bg-green-800 rounded-full w-5 h-5 flex items-center justify-center">
                            {pathIndex + 1}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <button
                onClick={() => setShowWordPath(null)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Playing phase
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <div className="text-center flex-1">
          <p className="text-gray-400 text-sm">Score</p>
          <p className="text-2xl font-bold text-white">{score.toLocaleString()}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-gray-400 text-sm">Time</p>
          <p className={`text-2xl font-bold ${timeRemaining <= 10 ? 'text-red-400' : 'text-white'}`}>
            {timeRemaining}s
          </p>
        </div>
        <div className="text-center flex-1">
          <p className="text-gray-400 text-sm">Words</p>
          <p className="text-2xl font-bold text-blue-400">{foundWords.size}</p>
        </div>
      </div>

      {/* Word preview & feedback (fixed space, top-aligned) */}
      <div className="w-fit max-w-md mb-4" aria-live="polite">
        <div
          className={`h-14 flex items-center justify-center rounded-lg px-4 font-bold text-lg tracking-wider transition-all duration-200
            ${selectedPath.length || wordFeedback ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            ${(() => {
              if (selectedPath.length) return 'bg-gray-800 text-white'
              if (!wordFeedback) return 'bg-gray-800 text-gray-200'
              if (wordFeedback.status === 'valid') return 'bg-green-600 text-white'
              if (wordFeedback.status === 'duplicate') return 'bg-yellow-400 text-gray-900'
              return 'bg-red-600 text-white'
            })()}`}
        >
          {selectedPath.length
            ? selectedPath.map(i => board[i]).join('')
            : wordFeedback
              ? (() => {
                  if (wordFeedback.status === 'valid') {
                    return `${wordFeedback.word.toUpperCase()} (+${wordFeedback.points})`
                  }
                  if (wordFeedback.status === 'duplicate') {
                    return `${wordFeedback.word.toUpperCase()}`
                  }
                  return `${wordFeedback.word.toUpperCase()}`
                })()
              : ' '}
        </div>
      </div>

      {/* Board */}
      <div 
        ref={boardRef}
        className="relative w-full max-w-md aspect-square bg-gray-800 rounded-2xl p-2 select-none"
        style={{ touchAction: 'none' }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* SVG for connecting lines */}
        {selectedPath.length > 1 && (() => {
          // Determine line color based on current word validity
          let lineColor = '#3B82F6' // Blue - default/not enough letters
          if (selectedPath.length >= 3) {
            const currentWord = selectedPath.map(i => board[i]).join('').toLowerCase()
            if (foundWords.has(currentWord)) {
              lineColor = '#EAB308' // Yellow - already used
            } else if (WORD_HUNT_DICTIONARY.has(currentWord)) {
              lineColor = '#16A34A' // Green - valid word
            } else {
              lineColor = '#3B82F6' // Blue - invalid word
            }
          }
          
          return (
            <svg className="absolute inset-0 pointer-events-none z-10" style={{ width: '100%', height: '100%' }}>
              {selectedPath.slice(0, -1).map((fromIndex, i) => {
                const toIndex = selectedPath[i + 1]
                const from = getTileCenter(fromIndex)
                const to = getTileCenter(toIndex)
                return (
                  <line
                    key={`${fromIndex}-${toIndex}`}
                    x1={`${from.x / 4}%`}
                    y1={`${from.y / 4}%`}
                    x2={`${to.x / 4}%`}
                    y2={`${to.y / 4}%`}
                    stroke={lineColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                )
              })}
            </svg>
          )
        })()}

        {/* Grid */}
        <div className="grid grid-cols-4 gap-3 h-full">
          {board.map((letter, index) => {
            const isSelected = selectedPath.includes(index)
            
            // Determine tile color based on current word validity
            let tileColor = 'bg-gray-700 text-white hover:bg-gray-600'
            if (isSelected && selectedPath.length >= 3) {
              const currentWord = selectedPath.map(i => board[i]).join('').toLowerCase()
              if (foundWords.has(currentWord)) {
                tileColor = 'bg-yellow-500 text-gray-900' // Already used
              } else if (WORD_HUNT_DICTIONARY.has(currentWord)) {
                tileColor = 'bg-green-600 text-white' // Valid word
              } else {
                tileColor = 'bg-blue-600 text-white' // Invalid word
              }
            } else if (isSelected) {
              tileColor = 'bg-blue-600 text-white' // Selected but not enough letters yet
            }
            
            return (
              <div
                key={index}
                data-tile-index={index}
                onPointerDown={(e) => handlePointerDown(e, index)}
                className={`
                  relative flex items-center justify-center rounded-xl font-black text-3xl
                  transition-all duration-150 cursor-pointer select-none
                  ${isSelected ? 'scale-105 shadow-xl z-10' : 'scale-100 shadow-md'}
                  ${tileColor}
                `}
                style={{ touchAction: 'none' }}
              >
                {letter}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
