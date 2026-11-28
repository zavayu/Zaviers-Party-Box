import { useState } from 'react'
import ImposterActionBar from '../components/ImposterActionBar'
import ImposterRoleCard from '../components/ImposterRoleCard'
import GAME_DATA from '../game-data/imposterData'

import { CategoryField, CountField, HintField } from '../components/ImposterSetupFields'
import ImposterClueOrder from '../components/ImposterClueOrder'
import { getHintedWords, getWordHint } from '../game-data/imposterHints'

const categories = Object.keys(GAME_DATA)
const secondaryButton = 'w-full min-h-14 bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-3 rounded-lg'

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
  const [wordHints, setWordHints] = useState(true)
  const [usedWords, setUsedWords] = useState(new Set())
  const [round, setRound] = useState(null)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)

  const startRound = () => {
    const allowed = selectedCategory ? [selectedCategory] : categories
    const wordsFor = category => {
      const words = GAME_DATA[category].words
      return wordHints ? getHintedWords(category, words) : words
    }
    const unused = word => !usedWords.has(word.toLowerCase())
    const available = allowed.filter(category => wordsFor(category).some(unused))
    const category = shuffle(available.length ? available : allowed)[0]
    const words = wordsFor(category)
    const choices = words.filter(available.length ? unused : word => word !== round?.secretWord)
    const secretWord = shuffle(choices.length ? choices : words)[0]
    const playerIndices = Array.from({ length: playerCount }, (_, index) => index)

    const nextUsed = new Set(usedWords)
    if (!available.length) allowed.forEach(key => wordsFor(key).forEach(word => nextUsed.delete(word.toLowerCase())))
    nextUsed.add(secretWord.toLowerCase())
    setUsedWords(nextUsed)
    setRound({
      category, secretWord,
      wordHint: wordHints ? getWordHint(category, secretWord) : undefined,
      imposterIndices: shuffle(playerIndices).slice(0, imposterCount),
      clueOrder: shuffle(playerIndices),
    })
    setCurrentPlayerIndex(0)
    setIsRevealed(false)
    setGamePhase('playerReveal')
  }

  const handleNextPlayer = () => {
    setIsRevealed(false)
    if (currentPlayerIndex + 1 === playerCount) setGamePhase('table')
    else setCurrentPlayerIndex(currentPlayerIndex + 1)
  }

  const { category, secretWord, imposterIndices, clueOrder } = round ?? {}

  const action = {
    setup: { label: 'Start Round' },
    playerReveal: isRevealed
      ? { label: currentPlayerIndex + 1 === playerCount ? 'Hide & Begin Round' : 'Hide & Pass Phone', onClick: handleNextPlayer }
      : { label: 'Reveal My Role', onClick: () => setIsRevealed(true) },
    table: { label: 'Reveal Imposters', onClick: () => setGamePhase('results') },
    results: { label: 'Play Again', onClick: startRound },
  }[gamePhase]

  return (
    <div className="game-screen imposter-screen">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <button onClick={gamePhase === 'setup' ? onBack : () => setGamePhase('setup')} className="page-back">
            ← {gamePhase === 'setup' ? 'Games' : 'Setup'}
          </button>
          {gamePhase !== 'setup' && <span className="text-gray-400 text-sm">Imposter</span>}
        </div>

        {gamePhase === 'setup' && (
          <form id="imposter-setup" className="game-panel space-y-5" onSubmit={event => { event.preventDefault(); startRound() }}>
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
          </form>
        )}

        {gamePhase === 'playerReveal' && (
          <section className="game-panel text-center">
            <h2 className="text-3xl font-bold mb-5">Player {currentPlayerIndex + 1}</h2>
            {isRevealed ? (
              <ImposterRoleCard
                category={category}
                isImposter={imposterIndices.includes(currentPlayerIndex)}
                secretWord={secretWord}
                wordHint={round.wordHint}
              />
            ) : (
              <p className="text-gray-300">Keep the screen to yourself while you reveal your role.</p>
            )}
          </section>
        )}

        {gamePhase === 'table' && (
          <section className="game-panel space-y-4">
            <h2 className="text-2xl font-bold">Clues & Voting</h2>
            <p>Give one word each in this order.</p>
            <ImposterClueOrder names={clueOrder.map(index => `Player ${index + 1}`)} />
            <p>Discuss the clues, then count to three and point to your suspect. Reveal the roles after everyone votes.</p>
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
            <button className={`${secondaryButton} mt-3`} onClick={() => setGamePhase('setup')}>Change Category</button>
          </div>
        )}

        <ImposterActionBar>
          <button
            className="imposter-action"
            type={gamePhase === 'setup' ? 'submit' : 'button'}
            form={gamePhase === 'setup' ? 'imposter-setup' : undefined}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        </ImposterActionBar>
      </div>
    </div>
  )
}

export default ImposterGame
