import { useId } from 'react'

export function categoryLabel(category) {
  if (category === 'VideoGames') return 'Video Games'
  if (category === 'Animes') return 'Anime'
  return category?.replace(/_/g, ' ')
}

const fieldClass = 'block w-full min-h-11 mt-1 rounded-lg bg-gray-700 px-3 text-white'

export function CategoryField({ categories, value, onChange }) {
  const id = useId()
  return (
    <div>
      <label className="font-semibold" htmlFor={id}>Category</label>
      <select id={id} className={fieldClass} value={value} onChange={event => onChange(event.target.value)}>
        <option value="">Random category</option>
        {categories.map(category => <option key={category} value={category}>{categoryLabel(category)}</option>)}
      </select>
    </div>
  )
}

export function CountField({ label, value, min, max, onChange }) {
  const id = useId()
  return (
    <div>
      <label className="font-semibold" htmlFor={id}>{label}</label>
      <select id={id} className={fieldClass} value={value} onChange={event => onChange(Number(event.target.value))}>
        {Array.from({ length: max - min + 1 }, (_, index) => min + index).map(count => (
          <option key={count} value={count}>{count}</option>
        ))}
      </select>
    </div>
  )
}

export function HintField({ checked, onChange }) {
  return (
    <label className="flex min-h-11 items-center gap-3">
      <input type="checkbox" className="size-5" checked={checked} onChange={event => onChange(event.target.checked)} />
      <span>Give the imposter a word hint when available</span>
    </label>
  )
}
