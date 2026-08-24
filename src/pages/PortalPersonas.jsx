import { useState } from "react"

const DOCS = [
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "NIT",
  "Pasaporte",
]

export default function PortalPersonas({ onBack }) {
  const [docType, setDocType] = useState(DOCS[0])
  const [document, setDocument] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const ready = document.trim().length > 4 && password.trim().length > 3

  function submit(event) {
    event.preventDefault()
  }

  return (
    <div className="portal">
      <section className="portal__intro">
        <img className="portal__man" src="/portal-man.jpg" alt="" />
        <div className="portal__copy">
          <h1>Invierta con <em>Alianza</em></h1>
          <p>
            Bienvenido a Alianza en línea, protegemos el futuro con experiencia y
            responsabilidad para asegurar su bienestar financiero.
          </p>
        </div>
      </section>

      <section className="portal__form">
        <header className="portal__top">
          <button type="button" className="portal__brand" onClick={onBack}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <polygon points="24 4 10 42 24 33" fill="#1f6fbf" />
              <polygon points="24 4 38 42 24 33" fill="#d6e34c" />
              <polygon points="10 42 38 42 24 33" fill="#2aa57c" />
            </svg>
            <span>
              Alianza
              <small>en líne@</small>
            </span>
          </button>
          <nav>
            <button type="button">Recomendaciones</button>
            <button type="button">Español</button>
            <button type="button">English</button>
          </nav>
        </header>

        <form className="portal__card" onSubmit={submit}>
          <h2>¡Bienvenido!</h2>

          <label>
            <span>Tipo de documento *</span>
            <select value={docType} onChange={(event) => setDocType(event.target.value)}>
              {DOCS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Número de documento *</span>
            <input
              value={document}
              onChange={(event) => setDocument(event.target.value)}
              placeholder="Escriba el número de documento"
              autoComplete="username"
            />
          </label>

          <label>
            <span>Contraseña *</span>
            <span className="portal__pass">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingrese la contraseña"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword((open) => !open)}>
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </span>
          </label>

          <button type="button" className="portal__forgot">
            ¿Olvidó la contraseña?
          </button>

          <label className="portal__check">
            <input
              type="checkbox"
              checked={authorized}
              onChange={(event) => setAuthorized(event.target.checked)}
            />
            Personas Autorizadas
          </label>

          <button type="submit" className={`portal__submit ${ready ? "is-ready" : ""}`} disabled={!ready}>
            Ingrese
          </button>
        </form>
      </section>
    </div>
  )
}
