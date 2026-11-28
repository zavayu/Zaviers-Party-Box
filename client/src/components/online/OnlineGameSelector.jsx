import GameMenu from '../GameMenu'

const games = [
  {
    to: '/online/imposter',
    title: 'Imposter',
    icon: '🕵️',
    description: 'Find the player who doesn’t know the secret word.',
    detail: '3–10 players',
  },
  {
    to: '/online/word-hunt',
    title: 'Word Hunt',
    icon: '🔤',
    description: 'Swipe to form words and compete for the highest score.',
    detail: '2–8 players',
  },
]

export default function OnlineGameSelector() {
  return <GameMenu title="Online" items={games} />
}
