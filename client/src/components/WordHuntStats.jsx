export default function WordHuntStats({ wordCount, score, secondsRemaining }) {
  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = String(secondsRemaining % 60).padStart(2, '0')

  return (
    <dl className="word-hunt-stats">
      <div><dt>Words</dt><dd>{wordCount}</dd></div>
      <div><dt>Score</dt><dd>{score.toLocaleString()}</dd></div>
      <div>
        <dt>Time left</dt>
        <dd className={secondsRemaining <= 10 ? 'text-red-400' : undefined}>{minutes}:{seconds}</dd>
      </div>
    </dl>
  )
}
