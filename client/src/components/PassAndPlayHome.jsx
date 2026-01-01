import { Link, useNavigate } from 'react-router-dom'

const GAMES = [
  {
    id: 'imposter',
    name: 'Imposter',
    emoji: '🕵️',
    blurb: 'One player is the imposter. Find out who!',
  },
  {
    id: 'wrong-answer',
    name: "Wrong Answer",
    emoji: '🔍',
    blurb: 'One person gets a different question. Spot the difference.',
  },
  {
    id: 'wordle',
    name: 'Wordle',
    emoji: '📝',
    blurb: 'Guess the word in 6 tries. Single player brain teaser.',
  },
  {
    id: 'word-hunt',
    name: 'Word Hunt',
    emoji: '🔤',
    blurb: 'Swipe to form words on the board. 80 seconds of word finding fun!',
  },
]

function PassAndPlayHome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-6">
        <div className="mb-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-200 hover:text-white text-sm bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg transition-colors"
          >
            ← Back to Home
          </button>
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GAMES.map((game) => (
            <Link
              key={game.id}
              to={`/play/${game.id}`}
              className="bg-gray-800 hover:bg-gray-700 text-left rounded-2xl p-6 border border-gray-700 transition-colors shadow-lg flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{game.emoji}</span>
                <span className="text-white text-xl font-bold">{game.name}</span>
              </div>
              <p className="text-gray-400 text-sm leading-snug">{game.blurb}</p>
              <span className="text-blue-300 text-sm font-semibold">Play</span>
            </Link>
          ))}
        </div>

        <div className="text-center text-gray-500 text-sm">
          More games coming soon.
        </div>
      </div>
    </div>
  )
}

export default PassAndPlayHome
