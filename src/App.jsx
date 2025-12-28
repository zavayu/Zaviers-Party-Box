import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import ImposterGame from './games/ImposterGame'
import OutlierGame from './games/OutlierGame'
import WordleGame from './games/WordleGame'
import WordHuntGame from './games/WordHuntGame'
import OnlineImposterGame from './games/OnlineImposterGame'
import OnlineGameSelector from './components/online/OnlineGameSelector'
import PassAndPlayHome from './components/PassAndPlayHome'

function ModeSelection() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-6">
        <div className="bg-linear-to-br from-gray-800 via-gray-850 to-gray-900 rounded-3xl p-10 shadow-2xl text-center border border-gray-700/70 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.12),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(244,114,182,0.12),transparent_26%)] pointer-events-none" />
          <div className="relative">
            <img src="./monkeyparty.png" className='h-32 mx-auto' alt="Game Logo" />
            <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Zavier's Party Box
            </h1>
            <p className="text-gray-300 text-lg max-w-lg mx-auto leading-relaxed">
              Uhh there are games here or something
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to="/play"
            className="block bg-gray-800 hover:bg-gray-700 rounded-2xl p-8 border border-gray-700 transition-colors shadow-lg"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">👥</span>
              <div className="flex-1 text-left">
                <h3 className="text-white text-2xl font-bold mb-2">Pass & Play</h3>
                <p className="text-gray-400 text-sm">Play together on one device</p>
              </div>
            </div>
          </Link>

          <button
            onClick={() => navigate('/online')}
            className="w-full bg-gray-800 hover:bg-gray-700 rounded-2xl p-8 border border-gray-700 transition-colors shadow-lg text-left"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">🌐</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white text-2xl font-bold">Online</h3>
                  <span className="bg-yellow-600 text-yellow-100 text-xs font-semibold px-2 py-1 rounded">Beta</span>
                </div>
                <p className="text-gray-400 text-sm">Play with friends online</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function GameWrapper({ GameComponent }) {
  const navigate = useNavigate()
  return <GameComponent onBack={() => navigate('/play')} />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<ModeSelection />} />
      <Route path="/play" element={<PassAndPlayHome />} />
      <Route path="/play/secret-word" element={<GameWrapper GameComponent={ImposterGame} />} />
      <Route path="/play/wrong-answer" element={<GameWrapper GameComponent={OutlierGame} />} />
      <Route path="/play/wordle" element={<GameWrapper GameComponent={WordleGame} />} />
      <Route path="/play/word-hunt" element={<GameWrapper GameComponent={WordHuntGame} />} />
      <Route path="/online" element={<OnlineGameSelector />} />
      <Route path="/online/secret-word" element={<OnlineImposterGame />} />
    </Routes>
  )
}

export default App
