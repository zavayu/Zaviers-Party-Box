import { useState } from 'react'
import { CategoryField, CountField, HintField } from '../ImposterSetupFields'

export default function GameSettings({ onClose, currentSettings, onUpdateSettings, playerCount }) {
  const maxImposters = Math.max(1, playerCount - 1)
  const [category, setCategory] = useState(currentSettings.selectedCategory ?? '')
  const [count, setCount] = useState(currentSettings.imposterCount ?? 1)
  const [wordHints, setWordHints] = useState(currentSettings.wordHints ?? false)
  const imposterCount = Math.min(count, maxImposters)

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="imposter-settings-title"
        className="game-panel max-w-md w-full max-h-[90dvh] overflow-y-auto space-y-5"
        onSubmit={event => {
          event.preventDefault()
          onUpdateSettings({ category, imposterCount, wordHints })
          onClose()
        }}
      >
        <h2 className="text-2xl font-bold" id="imposter-settings-title">Imposter Settings</h2>
        <p className="text-gray-300">{playerCount} {playerCount === 1 ? 'player' : 'players'} in the room</p>
        <CategoryField categories={currentSettings.availableCategories ?? []} value={category} onChange={setCategory} />
        <CountField label="Imposters" value={imposterCount} min={1} max={maxImposters} onChange={setCount} />
        <HintField checked={wordHints} onChange={setWordHints} />
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 min-h-11 rounded-lg bg-gray-700 px-4 font-bold">Cancel</button>
          <button className="flex-1 min-h-11 rounded-lg bg-blue-600 px-4 font-bold">Save</button>
        </div>
      </form>
    </div>
  )
}
