const starterHints = {
  Animals: 'Try a clue about how the animal moves or where it lives.',
  Food: 'Try a clue about texture or when you might eat it.',
  Movies: 'Try a clue about the mood or genre.',
  Sports: 'Try a clue about the playing surface or what players wear.',
  'Video Games': 'Try a clue about how the game feels to play.',
  Professions: 'Try a clue about the workplace or a tool someone might use.',
  Celebrities: 'Try a clue about what the person is known for.',
  Countries: 'Try a clue about the landscape or a local tradition.',
  Cities: 'Try a clue about the skyline or how people get around.',
  Superheroes: 'Try a clue about a costume, power, or personality trait.',
  Brands: 'Try a clue about where you might see the brand.',
  Instruments: 'Try a clue about how someone plays it or how it sounds.',
  Technology: 'Try a clue about where or why someone might use it.',
  Clothing: 'Try a clue about the weather or occasion you would wear it for.',
  School: 'Try a clue about what a typical assignment might involve.',
  Body: 'Try a clue about where it is or what it helps you do.',
  Hobbies: 'Try a clue about where someone would do it or what they might need.',
  Anime: 'Try a clue about the setting or tone of the story.',
  'Clash Royale': 'Try a clue about how someone might use the card in a match.',
  'TV Shows': 'Try a clue about the setting or genre.',
  Colors: 'Try a clue about where you might see that color.',
  Vehicles: 'Try a clue about where it travels or what it carries.',
  Furniture: 'Try a clue about which room it belongs in or how it is used.',
  Weather: 'Try a clue about what someone might wear or do outside.',
  Nature: 'Try a clue about what someone might see or hear nearby.',
  'Board Games': 'Try a clue about what players do on their turn.',
  'School Supplies': 'Try a clue about what kind of assignment it helps with.',
  'Kitchen Tools': 'Try a clue about a cooking step where it might come in handy.',
  'Amusement Parks': 'Try a clue about what you might see, hear, or feel.',
  'Camping Gear': 'Try a clue about when during a trip you might need it.',
}

const categoryLabels = { VideoGames: 'Video Games', Animes: 'Anime' }

export default function ImposterRoleCard({ category, isImposter, secretWord }) {
  const label = categoryLabels[category] ?? category?.replace(/_/g, ' ')
  const hint = starterHints[label] ?? 'Try a clue about where you might encounter something in this category.'

  return (
    <div className="rounded-xl bg-gray-900 p-8 mb-8 text-center">
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
            <>
              <p className="text-sm font-semibold text-gray-300 mb-2">First-turn hint</p>
              <p className="text-gray-200">{hint}</p>
            </>
          ) : (
            <p className="text-3xl font-bold text-gray-100">{secretWord}</p>
          )}
        </>
      )}
    </div>
  )
}
