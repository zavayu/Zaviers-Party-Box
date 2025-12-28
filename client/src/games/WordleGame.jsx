import { useState, useEffect } from 'react'
import { words, allowed } from '../game-data/wordleData'

export default function WordleGame({ onBack }) {
  const [gamePhase, setGamePhase] = useState('home')
  const [targetWord, setTargetWord] = useState('')
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameStatus, setGameStatus] = useState('playing') // playing, won, lost
  const [invalidWord, setInvalidWord] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const initGame = () => {
    const word = words[Math.floor(Math.random() * words.length)].toUpperCase()
    setTargetWord(word)
    setGuesses([])
    setCurrentGuess('')
    setGameStatus('playing')
    setGamePhase('playing')
  }

  const handleKeyPress = (e) => {
    if (gameStatus !== 'playing') return
    
    const key = e.key.toUpperCase()

    if (key === 'ENTER') {
      handleGuess()
      return
    }

    if (key === 'BACKSPACE') {
      setCurrentGuess((prev) => prev.slice(0, -1))
      return
    }

    if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key)
    }
  }

  const handleGuess = () => {
    if (currentGuess.length !== 5) return

    // Check if word exists in dictionary
    if (!allowed.has(currentGuess.toLowerCase())) {
      setInvalidWord(true)
      setTimeout(() => setInvalidWord(false), 500)
      return
    }

    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)

    if (currentGuess === targetWord) {
      setGameStatus('won')
      setShowPopup(true)
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost')
      setShowPopup(true)
    }

    setCurrentGuess('')
  }

  const getLetterColor = (letter, index, word) => {
    if (word[index] === letter) return 'bg-green-600'
    if (word.includes(letter)) return 'bg-yellow-500'
    return 'bg-gray-600'
  }

  const getKeyboardColor = (letter) => {
    for (let guess of guesses) {
      for (let i = 0; i < 5; i++) {
        if (guess[i] === letter) {
          if (guess[i] === targetWord[i]) return 'bg-green-600 text-white'
          if (targetWord.includes(letter)) return 'bg-yellow-500 text-black'
          return 'bg-gray-500 text-white'
        }
      }
    }
    return 'bg-gray-700 hover:bg-gray-600 text-white'
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentGuess, gameStatus])

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
            <h1 className="text-5xl font-black text-white mb-2">Wordle</h1>
            <p className="text-gray-400">Guess the word in 6 tries!</p>
          </div>

          <div className="space-y-3">
            <div className="bg-green-600 rounded-lg p-3 text-left text-sm text-white">
              <p className="font-semibold">🟩 Correct</p>
              <p className="text-gray-100">Letter is in the word and in the right spot</p>
            </div>
            <div className="bg-yellow-500 rounded-lg p-3 text-left text-sm text-black">
              <p className="font-semibold">🟨 Present</p>
              <p>Letter is in the word but in the wrong spot</p>
            </div>
            <div className="bg-gray-600 rounded-lg p-3 text-left text-sm text-white">
              <p className="font-semibold">⬜ Not in word</p>
              <p className="text-gray-100">Letter is not in the word</p>
            </div>
          </div>

          <button
            onClick={initGame}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    )
  }

  if (gamePhase === 'playing') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-3">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>

        {/* Play Again button when game is over and popup is closed */}
        {gameStatus !== 'playing' && !showPopup && (
          <button
            onClick={initGame}
            className="absolute top-6 right-6 px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
          >
            Play Again
          </button>
        )}

        <h1 className="text-4xl font-black text-white mb-8">Wordle</h1>

        {/* Guesses Grid */}
        <div className="space-y-2 mb-8">
          {Array(6)
            .fill(null)
            .map((_, rowIdx) => (
              <div key={rowIdx} className="flex gap-2">
                {Array(5)
                  .fill(null)
                  .map((_, colIdx) => {
                    const letter = guesses[rowIdx]?.[colIdx] || ''
                    const isCurrentRow = rowIdx === guesses.length
                    const currentLetter = currentGuess[colIdx] || ''

                    let bgColor = 'bg-gray-800'
                    let borderColor = 'border-gray-700'
                    
                    if (letter) {
                      bgColor = getLetterColor(letter, colIdx, targetWord)
                    } else if (isCurrentRow && currentLetter) {
                      bgColor = 'bg-gray-700'
                    }

                    if (isCurrentRow && invalidWord) {
                      borderColor = 'border-red-500 animate-shake'
                    }

                    return (
                      <div
                        key={colIdx}
                        className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold text-white border-2 ${borderColor} ${bgColor} transition-all`}
                      >
                        {isCurrentRow ? currentLetter : letter}
                      </div>
                    )
                  })}
              </div>
            ))}
        </div>

        {/* Game Over Messages */}
        {gameStatus === 'won' && showPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setShowPopup(false)}>
            <div className="bg-gray-800 rounded-2xl p-8 text-center border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <p className="text-5xl flex-1">🎉</p>
              </div>
              <p className="text-3xl font-bold text-green-400 mb-3">You Won!</p>
              <p className="text-gray-300 mb-6">
                Solved in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}
              </p>
              <button
                onClick={initGame}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {gameStatus === 'lost' && showPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setShowPopup(false)}>
            <div className="bg-gray-800 rounded-2xl p-8 text-center border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <p className="text-5xl flex-1">😔</p>
              </div>
              <p className="text-3xl font-bold text-red-400 mb-3">Game Over!</p>
              <p className="text-gray-300 mb-6">The word was: <span className="font-bold text-lg">{targetWord}</span></p>
              <button
                onClick={initGame}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Keyboard */}
        <div className="w-full space-y-2 mb-6">
          {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, idx) => (
            <div
              key={idx}
              className="flex gap-1.5 justify-center"
            >
              {idx === 2 && (
                <button
                  onClick={handleGuess}
                  className="w-16 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-xs transition-all disabled:opacity-50"
                  disabled={gameStatus !== 'playing' || currentGuess.length !== 5}
                >
                  ENTER
                </button>
              )}
              {row.split('').map((letter) => (
                <button
                  key={letter}
                  onClick={() => {
                    if (gameStatus === 'playing') {
                      setCurrentGuess((prev) => {
                        if (prev.length < 5) return prev + letter
                        return prev
                      })
                    }
                  }}
                  className={`w-10 h-14 rounded-md font-bold text-lg transition-all ${getKeyboardColor(letter)}`}
                  disabled={gameStatus !== 'playing'}
                >
                  {letter}
                </button>
              ))}
              {idx === 2 && (
                <button
                  onClick={() => setCurrentGuess((prev) => prev.slice(0, -1))}
                  className="w-16 h-14 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-bold text-xl transition-all disabled:opacity-50"
                  disabled={gameStatus !== 'playing' || currentGuess.length === 0}
                >
                  ⌫
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
