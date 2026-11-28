import GameMenu from './GameMenu'

const games = [
  { to: '/play/imposter', title: 'Imposter', icon: '🕵️', description: 'Find the player who doesn’t know the secret word.' },
  { to: '/play/wrong-answer', title: 'Wrong Answer', icon: '🔍', description: 'Spot who got a different question.' },
  { to: '/play/wordle', title: 'Wordle', icon: '📝', description: 'Guess the five-letter word in six tries.', detail: 'Solo' },
  { to: '/play/word-hunt', title: 'Word Hunt', icon: '🔤', description: 'Swipe to find as many words as you can in 80 seconds.' },
]

export default function PassAndPlayHome() {
  return <GameMenu title="Pass & Play" items={games} />
}
