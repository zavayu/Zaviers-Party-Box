import { useState } from 'react'
import GAME_DATA from '../../game-data/imposterData.js'

function GameSettings({ 
  isOpen, 
  onClose, 
  currentSettings = {}, 
  onUpdateSettings,
  gameTitle = "Game"
}) {
  const [selectedCategory, setSelectedCategory] = useState(currentSettings.selectedCategory || '')

  const handleSave = () => {
    const settings = {}
    if (selectedCategory) {
      settings.category = selectedCategory
    }
    onUpdateSettings(settings)
    onClose()
  }

  const handleReset = () => {
    setSelectedCategory('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{gameTitle} Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Category {selectedCategory ? '' : '(Random)'}
            </label>
            
            {/* Random Option */}
            <button
              onClick={() => setSelectedCategory('')}
              className={`w-full mb-3 p-4 rounded-xl border-2 transition-colors ${
                selectedCategory === ''
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎲</span>
                <div className="text-left">
                  <div className="font-semibold">Random Category</div>
                  <div className="text-sm opacity-75">Let the game choose</div>
                </div>
              </div>
            </button>

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {Object.keys(GAME_DATA).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-3 rounded-lg border transition-colors text-left ${
                    selectedCategory === category
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">{GAME_DATA[category].emoji}</span>
                    <span className="text-xs font-medium text-center">{category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameSettings