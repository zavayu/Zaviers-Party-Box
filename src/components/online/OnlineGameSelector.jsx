import { useNavigate } from 'react-router-dom'

const ONLINE_GAMES = [
  {
    id: 'secret-word',
    name: 'Secret Word',
    emoji: '🕵️',
    description: 'One player is the imposter. Find out who!',
    minPlayers: 3,
    maxPlayers: 10,
    route: '/online/secret-word'
  },
  // Future games will be added here
  // {
  //   id: 'wrong-answer',
  //   name: 'Wrong Answer',
  //   emoji: '🔍',
  //   description: 'One person gets a different question. Spot the difference.',
  //   minPlayers: 3,
  //   maxPlayers: 8,
  //   route: '/online/wrong-answer'
  // }
]

function OnlineGameSelector() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-200 hover:text-white text-sm bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg transition-colors"
          >
            ← Back to Home
          </button>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 text-center shadow-2xl">
          <div className="mb-6">
            <span className="text-6xl mb-4 block">🌐</span>
            <h1 className="text-4xl font-extrabold text-white mb-4">
              Online Mode (Beta)
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Select a game to play online
            </p>
          </div>

      <div className="space-y-4">
        {ONLINE_GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => navigate(game.route)}
            className="w-full bg-gray-700 hover:bg-gray-600 rounded-2xl p-6 border border-gray-700 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{game.emoji}</span>
              <div className="flex-1">
                <h3 className="text-white text-2xl font-bold mb-1">{game.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{game.description}</p>
                <p className="text-gray-500 text-xs">
                  {game.minPlayers}-{game.maxPlayers} players
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
      </div>
    </div>
  )
}

export default OnlineGameSelector