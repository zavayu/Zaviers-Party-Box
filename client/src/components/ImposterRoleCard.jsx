import { categoryLabel } from './ImposterSetupFields'

export default function ImposterRoleCard({ category, isImposter, secretWord, wordHint }) {
  const label = categoryLabel(category)

  return (
    <div className="rounded-xl bg-gray-900 p-5 text-center">
      {label && (
        <>
          <p className="text-sm uppercase tracking-wide text-gray-300 mb-2">Category</p>
          <p className="text-xl font-semibold text-gray-100 mb-4">{label}</p>
        </>
      )}
      {isImposter == null ? (
        <p className="text-gray-300" role="status">Waiting for your role…</p>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-gray-100 mb-4">
            {isImposter ? 'You are the Imposter!' : 'Your secret word'}
          </h3>
          {isImposter ? (
            wordHint && (
              <>
                <p className="text-sm font-semibold text-gray-300 mb-1">Private hint</p>
                <p className="text-2xl font-bold text-gray-100">{wordHint}</p>
              </>
            )
          ) : (
            <p className="text-3xl font-bold text-gray-100">{secretWord}</p>
          )}
        </>
      )}
    </div>
  )
}
