import { useEffect, useRef, useState } from "react"
import Logo from "./Logo"

const NAV = [
  { id: "inicio", label: "Inicio" },
  { id: "nosotros", label: "Nosotros" },
  { id: "que-hacemos", label: "Qué hacemos" },
  { id: "educacion", label: "Educación financiera" },
  { id: "atencion", label: "Atención al cliente" },
  { id: "blog", label: "Blog" },
]

export default function Header({ page, onNavigate }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState("")
  const loginRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    function onPointerDown(event) {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setLoginOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.focus()
    }
  }, [searchOpen])

  function go(id) {
    onNavigate(id)
    setMenuOpen(false)
    setSearchOpen(false)
    setLoginOpen(false)
  }

  function submitSearch(event) {
    event.preventDefault()
    if (!query.trim()) return
    go("blog")
    setQuery("")
  }

  return (
    <header className="header">
      <div className="header__bar">
        <button className="header__brand" onClick={() => go("inicio")} type="button">
          <Logo />
        </button>

        <nav className={`nav ${menuOpen ? "nav--open" : ""}`} aria-label="Principal">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav__link ${page === item.id ? "is-active" : ""}`}
              onClick={() => go(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header__actions">
          <button
            type="button"
            className="search-btn"
            onClick={() => {
              setSearchOpen((open) => !open)
              setLoginOpen(false)
            }}
          >
            <SearchIcon />
            <span>Buscar</span>
          </button>

          <div className="login" ref={loginRef}>
            <button
              type="button"
              className="login__btn"
              aria-expanded={loginOpen}
              onClick={() => {
                setLoginOpen((open) => !open)
                setSearchOpen(false)
              }}
            >
              <UserIcon />
              <span>Ingresar</span>
              <ChevronIcon open={loginOpen} />
            </button>
            {loginOpen && (
              <div className="login__menu">
                <p>Acceda a Alianza en línea</p>
                <button type="button" onClick={() => go("inicio")}>
                  Portal Personas
                </button>
                <button type="button" onClick={() => go("inicio")}>
                  Portal Empresas
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="menu-toggle"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {searchOpen && (
        <form className="search-panel" onSubmit={submitSearch}>
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="¿Qué desea encontrar?"
          />
          <button type="submit">Buscar</button>
        </form>
      )}
    </header>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8.2" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 18.8c1.3-3 3.6-4.5 6.5-4.5s5.2 1.5 6.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg className={open ? "is-open" : ""} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
