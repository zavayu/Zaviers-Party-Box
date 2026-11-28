import { Routes, Route, useNavigate } from 'react-router-dom'
import ImposterGame from './games/ImposterGame'
import OutlierGame from './games/OutlierGame'
import WordleGame from './games/WordleGame'
import WordHuntGame from './games/WordHuntGame'
import OnlineImposterGame from './games/OnlineImposterGame'
import OnlineWordHuntGame from './games/OnlineWordHuntGame'
import OnlineGameSelector from './components/online/OnlineGameSelector'
import GameMenu from './components/GameMenu'
import PassAndPlayHome from './components/PassAndPlayHome'

const modes = [
  { to: '/play', title: 'Pass & Play', description: 'Share one device' },
  { to: '/online', title: 'Online', description: 'Play together with a room code' },
]

function GameWrapper({ GameComponent }) {
  const navigate = useNavigate()
  return <GameComponent onBack={() => navigate('/play')} />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<GameMenu title="Zavier’s Party Box" items={modes} home />} />
      <Route path="/play" element={<PassAndPlayHome />} />
      <Route path="/play/imposter" element={<GameWrapper GameComponent={ImposterGame} />} />
      <Route path="/play/wrong-answer" element={<GameWrapper GameComponent={OutlierGame} />} />
      <Route path="/play/wordle" element={<GameWrapper GameComponent={WordleGame} />} />
      <Route path="/play/word-hunt" element={<GameWrapper GameComponent={WordHuntGame} />} />
      <Route path="/online" element={<OnlineGameSelector />} />
      <Route path="/online/imposter" element={<OnlineImposterGame />} />
      <Route path="/online/imposter/:roomCode" element={<OnlineImposterGame />} />
      <Route path="/online/word-hunt" element={<OnlineWordHuntGame />} />
      <Route path="/online/word-hunt/:roomCode" element={<OnlineWordHuntGame />} />
    </Routes>
  )
}

export default App
