import { useState } from 'react'
import ImposterRoleCard from '../components/ImposterRoleCard'
import GAME_DATA from '../game-data/imposterData'

import { CategoryField, CountField, HintField } from '../components/ImposterSetupFields'
import ImposterClueOrder from '../components/ImposterClueOrder'
import { getWordHint } from '../game-data/imposterHints'

const categories = Object.keys(GAME_DATA)
const primaryButton = 'w-full min-h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-lg'
const secondaryButton = 'w-full min-h-12 bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-3 rounded-lg'

function shuffle(items) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1))
    const item = shuffled[index]
    shuffled[index] = shuffled[other]
    shuffled[other] = item
  }
  return shuffled
}

function ImposterGame({ onBack }) {
  const [gamePhase, setGamePhase] = useState('setup')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [playerCount, setPlayerCount] = useState(3)
  const [imposterCount, setImposterCount] = useState(1)
  const [wordHints, setWordHints] = useState(false)
  const [usedWords, setUsedWords] = useState(new Set())
  const [round, setRound] = useState(null)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)

  const startRound = () => {
    const allowed = selectedCategory ? [selectedCategory] : categories
    const unused = word => !usedWords.has(word.toLowerCase())
    const available = allowed.filter(category => GAME_DATA[category].words.some(unused))
    const category = shuffle(available.length ? available : allowed)[0]
    const words = GAME_DATA[category].words
    const choices = words.filter(available.length ? unused : word => word !== round?.secretWord)
    const secretWord = shuffle(choices.length ? choices : words)[0]
    const playerIndices = Array.from({ length: playerCount }, (_, index) => index)

    const nextUsed = new Set(usedWords)
    if (!available.length) allowed.forEach(key => GAME_DATA[key].words.forEach(word => nextUsed.delete(word.toLowerCase())))
    nextUsed.add(secretWord.toLowerCase())
    setUsedWords(nextUsed)
    setRound({
      category, secretWord,
      imposterIndices: shuffle(playerIndices).slice(0, imposterCount),
      clueOrder: shuffle(playerIndices),
    })
    setCurrentPlayerIndex(0)
    setIsRevealed(false)
    setGamePhase('playerReveal')
  }

  const handleNextPlayer = () => {
    setIsRevealed(false)
    if (currentPlayerIndex + 1 === playerCount) setGamePhase('clues')
    else setCurrentPlayerIndex(currentPlayerIndex + 1)
  }

  const { category, secretWord, imposterIndices, clueOrder } = round ?? {}

  return (
    <div className="game-screen">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <button onClick={gamePhase === 'setup' ? onBack : () => setGamePhase('setup')} className="page-back">
            ← {gamePhase === 'setup' ? 'Games' : 'Setup'}
          </button>
          {gamePhase !== 'setup' && <span className="text-gray-400 text-sm">Imposter</span>}
        </div>

        {gamePhase === 'setup' && (
          <form className="game-panel space-y-5" onSubmit={event => { event.preventDefault(); startRound() }}>
            <h1 className="text-3xl font-extrabold">Imposter</h1>
            <CategoryField categories={categories} value={selectedCategory} onChange={setSelectedCategory} />
            <div className="grid grid-cols-2 gap-3">
              <CountField label="Players" value={playerCount} min={3} max={Math.max(20, playerCount + 1)} onChange={count => {
                setPlayerCount(count)
                setImposterCount(value => Math.min(value, count - 1))
              }} />
              <CountField label="Imposters" value={imposterCount} min={1} max={playerCount - 1} onChange={setImposterCount} />
            </div>
            <HintField checked={wordHints} onChange={setWordHints} />
            <button className={primaryButton}>Start Round</button>
          </form>
        )}

        {/* PLAYER REVEAL LOOP */}
        {gamePhase === 'playerReveal' && (
          <div className="game-panel">
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
                  onClick={() => setIsRevealed(true)}
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
                <ImposterRoleCard
                  category={category}
                  isImposter={imposterIndices.includes(currentPlayerIndex)}
                  secretWord={secretWord}
                  wordHint={wordHints ? getWordHint(secretWord) : undefined}
                />
                <button
                  onClick={handleNextPlayer}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
                >
                  {currentPlayerIndex + 1 === playerCount ? 'Hide & Start Clues' : 'Hide & Pass Phone'}
                </button>
              </>
            )}
          </div>
        )}

        {gamePhase === 'clues' && (
          <section className="game-panel space-y-4">
            <h2 className="text-2xl font-bold">First clues</h2>
            <p>Take turns giving one word each. Start with Player {clueOrder[0] + 1}.</p>
            <ImposterClueOrder names={clueOrder.map(index => `Player ${index + 1}`)} />
            <button className={primaryButton} onClick={() => setGamePhase('discussion')}>Start Discussion</button>
          </section>
        )}

        {gamePhase === 'discussion' && (
          <section className="game-panel space-y-4">
            <h2 className="text-2xl font-bold">Discussion</h2>
            <p>Compare clues and decide who seemed to be guessing.</p>
            <button className={primaryButton} onClick={() => setGamePhase('voting')}>Start Voting</button>
          </section>
        )}

        {gamePhase === 'voting' && (
          <section className="game-panel space-y-4">
            <h2 className="text-2xl font-bold">Vote</h2>
            <p>On the count of three, point to the player you think is an imposter.</p>
            <button className={primaryButton} onClick={() => setGamePhase('results')}>Reveal Imposters</button>
          </section>
        )}

        {/* RESULTS */}
        {gamePhase === 'results' && (
          <div className="game-panel">
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
              onClick={startRound}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Play Again
            </button>
            <button className={`${secondaryButton} mt-3`} onClick={() => setGamePhase('setup')}>Change Category</button>
          </div>
        )}

      </div>
    </div>
  )
}

export default ImposterGame
