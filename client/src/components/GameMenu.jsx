import { Link } from 'react-router-dom'

export default function GameMenu({ title, items, home = false }) {
  return (
    <main className={`game-menu${home ? ' game-menu-home' : ''}`}>
      {!home && <Link className="page-back" to="/">← Home</Link>}
      <header className="game-menu-header">
        {home && <img src={`${import.meta.env.BASE_URL}monkeyparty.png`} alt="" width="104" height="104" />}
        <h1>{title}</h1>
      </header>
      <ul className="game-menu-list">
        {items.map(({ to, title, description, detail, icon }) => (
          <li key={to}>
            <Link className="game-menu-link" to={to}>
              {icon && <span className="game-menu-icon" aria-hidden="true">{icon}</span>}
              <span className="game-menu-label">
                <strong>{title}</strong>
                <span>{description}</span>
                {detail && <small>{detail}</small>}
              </span>
              <span className="game-menu-arrow" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
