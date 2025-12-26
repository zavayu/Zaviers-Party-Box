import { useState } from 'react'
import OUTLIER_QUESTIONS from '../game-data/outlierData'

function OutlierGame({ onBack }) {
  const [gamePhase, setGamePhase] = useState('home')
  const [playerCount, setPlayerCount] = useState(3)
  const [outlierIndex, setOutlierIndex] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [answers, setAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')

  const handlePlayerCountSubmit = () => {
    if (playerCount >= 3) {
      setGamePhase('instructions')
    }
  }

  const handleStartGame = () => {
    // Pick random question pair
    const randomPair = OUTLIER_QUESTIONS[Math.floor(Math.random() * OUTLIER_QUESTIONS.length)]
    setCurrentQuestion(randomPair)

    // Pick random outlier
    const randomOutlier = Math.floor(Math.random() * playerCount)
    setOutlierIndex(randomOutlier)

    setCurrentPlayerIndex(0)
    setIsRevealed(false)
    setAnswers([])
    setCurrentAnswer('')
    setGamePhase('promptReveal')
  }

  const handleReveal = () => {
    setIsRevealed(true)
  }

  const handleNextPlayer = () => {
    // Store the current player's answer
    const newAnswers = [...answers, { playerIndex: currentPlayerIndex, answer: currentAnswer }]
    setAnswers(newAnswers)
    setCurrentAnswer('')

    if (currentPlayerIndex < playerCount - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1)
      setIsRevealed(false)
    } else {
      // All players answered, move to review
      setGamePhase('answersReview')
    }
  }

  const handleShowResults = () => {
    setGamePhase('reveal')
  }

  const handlePlayAgain = () => {
    setGamePhase('instructions')
    setAnswers([])
    setCurrentAnswer('')
  }

  const handleNewGame = () => {
    setGamePhase('home')
    setPlayerCount(3)
    setOutlierIndex(null)
    setCurrentQuestion(null)
    setCurrentPlayerIndex(0)
    setIsRevealed(false)
    setAnswers([])
    setCurrentAnswer('')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {onBack && (
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="text-gray-200 hover:text-white text-sm bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg transition-colors"
            >
              ← Games
            </button>
            <span className="text-gray-400 text-sm">Outlier</span>
          </div>
        )}

        {/* HOME SCREEN */}
        {gamePhase === 'home' && (
          <div className="bg-gray-800 rounded-2xl p-8 text-center shadow-2xl">
            <h1 className="text-6xl font-bold text-white mb-4">🔍</h1>
            <h2 className="text-4xl font-bold text-white mb-8">Who's the Outlier?</h2>
            <p className="text-gray-300 mb-8">
              One person gets a different question. Can you spot them?
            </p>
            <button
              onClick={() => setGamePhase('playerCount')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Start Game
            </button>
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

        {/* INSTRUCTIONS */}
        {gamePhase === 'instructions' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              How to Play
            </h2>
            <div className="bg-gray-700 rounded-xl p-6 mb-8 space-y-4">
              <div className="flex gap-4">
                <span className="text-2xl">📱</span>
                <p className="text-gray-300">
                  You'll pass the phone around. Everyone gets a question.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl">🔍</span>
                <p className="text-gray-300">
                  One person will receive a different question.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl">🗣️</span>
                <p className="text-gray-300">
                  Everyone enters their answer. They will be revealed later.
                </p>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl">🎯</span>
                <p className="text-gray-300">
                  Try to figure out who gave the wrong answer!
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-center mb-6 text-sm">
              {playerCount} players ready
            </p>
            <button
              onClick={handleStartGame}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Start
            </button>
          </div>
        )}

        {/* PROMPT REVEAL */}
        {gamePhase === 'promptReveal' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            {!isRevealed ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                  Player {currentPlayerIndex + 1}
                </h2>
                <div className="bg-gray-700 rounded-xl p-8 mb-8 text-center">
                  <p className="text-gray-300 text-xl mb-6">
                    Make sure only you can see the screen, then tap below to reveal your question.
                  </p>
                  <p className="text-gray-400 text-sm">
                    Don't let others see!
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
                <div className="bg-blue-900 rounded-xl p-8 mb-8 text-center">
                  <p className="text-6xl mb-4">❓</p>
                  <p className="text-xl text-blue-100 font-semibold mb-4">
                    Your Question:
                  </p>
                  <p className="text-2xl text-white font-bold leading-snug mb-6">
                    {currentPlayerIndex === outlierIndex
                      ? currentQuestion.outlier
                      : currentQuestion.main}
                  </p>
                  <p className="text-lg text-blue-100 font-semibold mb-3">
                    Your Answer:
                  </p>
                  <input
                    type="text"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                  />
                </div>
                <button
                  onClick={handleNextPlayer}
                  disabled={!currentAnswer.trim()}
                  className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
                >
                  Hide & Pass Phone
                </button>
              </>
            )}
          </div>
        )}

        {/* ANSWERS REVIEW */}
        {gamePhase === 'answersReview' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-white mb-6 text-center sticky top-0 bg-gray-800 pb-2">
              Everyone's Answers
            </h2>
            <div className="bg-blue-900 rounded-xl p-6 mb-6 text-center border border-blue-700">
              <p className="text-gray-300 text-sm mb-2">The Question:</p>
              <p className="text-xl text-white font-bold">{currentQuestion.main}</p>
            </div>
            <div className="space-y-3 mb-6">
              {Array.from({ length: playerCount }).map((_, idx) => {
                const playerAnswer = answers.find((a) => a.playerIndex === idx)
                return (
                  <div key={idx} className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Player {idx + 1}</p>
                    <p className="text-white font-semibold">
                      {playerAnswer?.answer || '(No answer)'}
                    </p>
                  </div>
                )
              })}
            </div>
            <p className="text-gray-400 text-center mb-6 text-sm">
              Review the answers. Who sounds different?
            </p>
            <button
              onClick={() => setGamePhase('discussion')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Continue to Discussion
            </button>
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
                🗣️ Everyone answer your question out loud
              </p>
              <p className="text-gray-300 text-lg">
                👂 Listen carefully to all answers
              </p>
              <p className="text-gray-300 text-lg">
                💭 Look for differences in responses
              </p>
              <p className="text-gray-300 text-lg">
                🤔 Discuss who you think the outlier is
              </p>
            </div>
            <p className="text-gray-400 text-center mb-6">
              When ready to reveal who it was...
            </p>
            <button
              onClick={handleShowResults}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Reveal Outlier
            </button>
          </div>
        )}

        {/* REVEAL */}
        {gamePhase === 'reveal' && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              The Outlier Was...
            </h2>
            <div className="bg-yellow-900 rounded-xl p-8 mb-6 text-center">
              <p className="text-6xl mb-4">⭐</p>
              <p className="text-5xl font-bold text-white mb-2">
                Player {outlierIndex + 1}
              </p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6 mb-8 text-center space-y-3">
              <p className="text-gray-300 text-sm">The Outlier's Question:</p>
              <p className="text-lg text-white font-semibold">
                {currentQuestion.outlier}
              </p>
              <p className="text-gray-400 text-sm border-t border-gray-600 pt-3 mt-3">
                Everyone Else's Question:
              </p>
              <p className="text-lg text-white font-semibold">
                {currentQuestion.main}
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handlePlayAgain}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={handleNewGame}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
              >
                New Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OutlierGame
