export default function ImposterClueOrder({ names }) {
  if (!names.length) return null

  return (
    <div className="mb-5">
      <h3 className="font-semibold mb-2">Speaking order</h3>
      <ol className="list-decimal list-inside space-y-1 text-gray-200">
        {names.map((name, index) => <li key={index}>{name}</li>)}
      </ol>
    </div>
  )
}
