import { useState } from 'react'
import GAME_DATA from '../game-data/imposterData'

function ImposterGame({ onBack }) {
  // Game state
  const [gamePhase, setGamePhase] = useState('home')
  const [category, setCategory] = useState('')
  const [playerCount, setPlayerCount] = useState(3)
  const [imposterCount, setImposterCount] = useState(1)
  const [imposterIndices, setImposterIndices] = useState([])
  const [secretWord, setSecretWord] = useState('')
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)

  // Start new game from home
  const handleStartGame = () => {
    setGamePhase('categorySelect')
  }

  // Select category and move to player count
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory)
    setGamePhase('playerCount')
  }

  // Set player count and move to imposter count
  const handlePlayerCountSubmit = () => {
    if (playerCount >= 3) {
      // Ensure imposters do not exceed players
      setImposterCount((prev) => Math.max(1, Math.min(prev, playerCount)))
      setGamePhase('imposterCount')
    }
  }

  // Set imposter count and move to confirm
  const handleImposterCountSubmit = () => {
    if (imposterCount >= 1 && imposterCount <= playerCount) {
      setGamePhase('confirm')
    }
  }

  // Confirm and initialize game
  const handleConfirm = () => {
    const words = GAME_DATA[category].words
    const randomWord = words[Math.floor(Math.random() * words.length)]
    setSecretWord(randomWord)

    // Pick random imposters
    const indices = Array.from({ length: playerCount }, (_, i) => i)
    for (let i = indices.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    setImposterIndices(indices.slice(0, imposterCount))

    setCurrentPlayerIndex(0)
    setIsRevealed(false)
    setGamePhase('playerReveal')
  }

  const handleReveal = () => {
    setIsRevealed(true)
  }

  const handleNextPlayer = () => {
    if (currentPlayerIndex < playerCount - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1)
      setIsRevealed(false)
    } else {
      setGamePhase('discussion')
    }
  }

  const handleShowResults = () => {
    setGamePhase('results')
  }

  const handlePlayAgain = () => {
    setGamePhase('home')
    setCategory('')
    setPlayerCount(3)
    setImposterCount(1)
    setImposterIndices([])
    setSecretWord('')
    setCurrentPlayerIndex(0)
    setIsRevealed(false)
  }

  const handleBack = () => {
    switch (gamePhase) {
      case 'home':
        if (onBack) onBack()
        break
      case 'categorySelect':
        setGamePhase('home')
        break
      case 'playerCount':
        setGamePhase('categorySelect')
        break
      case 'imposterCount':
        setGamePhase('playerCount')
        break
      case 'confirm':
        setGamePhase('imposterCount')
        break
      case 'playerReveal':
      case 'discussion':
      case 'results':
        // Once game has started, go back to home
        setGamePhase('home')
        setCategory('')
        setPlayerCount(3)
        setImposterCount(1)
        setImposterIndices([])
        setSecretWord('')
        setCurrentPlayerIndex(0)
        setIsRevealed(false)
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="text-gray-200 hover:text-white text-sm bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg transition-colors"
          >
            ← {gamePhase === 'home' ? 'Games' : gamePhase === 'playerReveal' || gamePhase === 'discussion' || gamePhase === 'results' ? 'Start' : 'Back'}
          </button>
          <span className="text-gray-400 text-sm">Imposter</span>
        </div>

        {/* HOME SCREEN */}
        {gamePhase === 'home' && (
          <div className="bg-gray-800 rounded-2xl p-8 text-center shadow-2xl">
            <h1 className="text-6xl font-bold text-white mb-4">🕵️</h1>
            <h2 className="text-4xl font-bold text-white mb-8">Imposter</h2>
            <p className="text-gray-300 mb-8">
              One player is the imposter. Can you find them?
            </p>
            <button
              onClick={handleStartGame}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {/* CATEGORY SELECT */}
        {gamePhase === 'categorySelect' && (
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center bg-gray-800 pb-2">
              Choose Category
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(GAME_DATA).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-semibold py-6 px-4 rounded-xl text-base transition-colors min-h-[80px] flex flex-col items-center justify-center text-center gap-2"
                >
                  <span className="text-3xl">{GAME_DATA[cat].emoji}</span>
                  <span>{cat.replace(/_/g, ' ')}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PLAYER COUNT */}
        {gamePhase === 'playerCount' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Number of Players
            </h2>
            
            <div className="bg-gray-700 rounded-2xl p-8 mb-6 text-center">
              <div className="text-6xl font-bold text-white mb-2">
                {playerCount}
              </div>
              <div className="text-gray-400 text-sm">players</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setPlayerCount(Math.max(3, playerCount - 1))}
                disabled={playerCount <= 3}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-6 px-8 rounded-xl text-4xl transition-colors"
              >
                −
              </button>
              <button
                onClick={() => setPlayerCount(playerCount + 1)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-xl text-4xl transition-colors"
              >
                +
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {[3, 5, 7, 10].map((count) => (
                <button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  className={`py-3 px-4 rounded-lg text-white font-semibold transition-colors ${
                    playerCount === count
                      ? 'bg-blue-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>

            <p className="text-gray-400 text-center mb-6 text-sm">
              Minimum 3 players required
            </p>

            <button
              onClick={handlePlayerCountSubmit}
              disabled={playerCount < 3}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* IMPOSTER COUNT */}
        {gamePhase === 'imposterCount' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Number of Imposters
            </h2>

            <div className="bg-gray-700 rounded-2xl p-8 mb-6 text-center">
              <div className="text-6xl font-bold text-white mb-2">
                {imposterCount}
              </div>
              <div className="text-gray-400 text-sm">imposters</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setImposterCount(Math.max(1, imposterCount - 1))}
                disabled={imposterCount <= 1}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-6 px-8 rounded-xl text-4xl transition-colors"
              >
                −
              </button>
              <button
                onClick={() => setImposterCount(Math.min(playerCount, imposterCount + 1))}
                disabled={imposterCount >= playerCount}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-6 px-8 rounded-xl text-4xl transition-colors"
              >
                +
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => setImposterCount(Math.min(count, playerCount))}
                  disabled={count > playerCount}
                  className={`py-3 px-4 rounded-lg text-white font-semibold transition-colors ${
                    imposterCount === count
                      ? 'bg-blue-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  } ${count > playerCount ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {count}
                </button>
              ))}
            </div>

            <p className="text-gray-400 text-center mb-6 text-sm">
              At least 1 imposter, and no more than players.
            </p>

            <button
              onClick={handleImposterCountSubmit}
              disabled={imposterCount < 1 || imposterCount > playerCount}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* CONFIRM */}
        {gamePhase === 'confirm' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Ready to Start?
            </h2>
            <div className="bg-gray-700 rounded-xl p-6 mb-8 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-lg">Category:</span>
                <span className="text-white font-bold text-lg">{category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-lg">Players:</span>
                <span className="text-white font-bold text-lg">{playerCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-lg">Imposters:</span>
                <span className="text-white font-bold text-lg">{imposterCount}</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 text-center">
              Pass the phone around. Each player will tap to reveal their role.
            </p>
            <button
              onClick={handleConfirm}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {/* PLAYER REVEAL LOOP */}
        {gamePhase === 'playerReveal' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            {!isRevealed ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                  Player {currentPlayerIndex + 1}
                </h2>
                <div className="bg-gray-700 rounded-xl p-8 mb-8 text-center">
                  <p className="text-gray-300 text-xl mb-6">
                    Make sure only you can see the screen, then tap below to reveal your role.
                  </p>
                  <p className="text-gray-400 text-sm">
                    Don't let others see your screen!
                  </p>
                </div>
                <button
                  onClick={handleReveal}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 px-8 rounded-xl text-xl transition-colors"
                >
                  Tap to Reveal
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Player {currentPlayerIndex + 1}
                </h2>
                <div className={`rounded-xl p-8 mb-8 text-center ${
                  imposterIndices.includes(currentPlayerIndex)
                    ? 'bg-red-900'
                    : 'bg-green-900'
                }`}>
                  {imposterIndices.includes(currentPlayerIndex) ? (
                    <>
                      <p className="text-6xl mb-4">🎭</p>
                      <p className="text-3xl font-bold text-white mb-4">
                        You are the Imposter!
                      </p>
                      <p className="text-red-200">
                        Pretend you know the secret word. Try not to get caught!
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-6xl mb-4">✓</p>
                      <p className="text-2xl text-green-200 mb-4">
                        The secret word is:
                      </p>
                      <p className="text-4xl font-bold text-white mb-4">
                        {secretWord}
                      </p>
                      <p className="text-green-200">
                        Find the imposter who doesn't know this word!
                      </p>
                    </>
                  )}
                </div>
                <button
                  onClick={handleNextPlayer}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
                >
                  Hide & Pass Phone
                </button>
              </>
            )}
          </div>
        )}

        {/* DISCUSSION */}
        {gamePhase === 'discussion' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Discussion Time
            </h2>
            <div className="bg-gray-700 rounded-xl p-6 mb-8 space-y-4">
              <p className="text-gray-300 text-lg">
                🗣️ Give one word hints about the secret word
              </p>
              <p className="text-gray-300 text-lg">
                🕵️ Try to identify the imposter
              </p>
              <p className="text-gray-300 text-lg">
                🎭 Imposter: blend in and survive!
              </p>
            </div>
            <p className="text-gray-400 text-center mb-6">
              When everyone is ready to see who the imposter was...
            </p>
            <button
              onClick={handleShowResults}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Reveal Imposter
            </button>
          </div>
        )}

        {/* RESULTS */}
        {gamePhase === 'results' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Results
            </h2>
            <div className="bg-red-900 rounded-xl p-8 mb-6 text-center">
              <p className="text-6xl mb-4">🎭</p>
              <p className="text-2xl text-red-200 mb-4">
                The imposters were:
              </p>
              <div className="text-white font-bold text-3xl mb-4 space-y-2">
                {imposterIndices.map((idx) => (
                  <div key={idx}>
                    Player {idx + 1}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-700 rounded-xl p-6 mb-8 text-center">
              <p className="text-gray-300 text-lg mb-2">
                The secret word was:
              </p>
              <p className="text-3xl font-bold text-white">
                {secretWord}
              </p>
            </div>
            <button
              onClick={handlePlayAgain}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Play Again
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default ImposterGame
