import { useState } from "react"

const DOCS = [
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "Tarjeta de Identidad",
  "Pasaporte",
  "Registro Civil",
  "NUIP",
]

export default function PortalPersonas({ onBack }) {
  const [docType, setDocType] = useState(DOCS[0])
  const [document, setDocument] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(false)
  const ready = document.trim().length > 4 && password.trim().length > 3

  function submit(event) {
    event.preventDefault()
    if (!ready || loading) return
    setLoading(true)
  }

  return (
    <div className={`portal ${loading ? "is-loading" : ""}`}>
      <section className="portal__intro">
        <div className="portal__copy">
          <h1>
            <span>Invierta con</span>
            <em>Alianza</em>
          </h1>
          <p>
            Bienvenido a Alianza en línea, protegemos el futuro con experiencia y
            responsabilidad para asegurar su bienestar financiero.
          </p>
        </div>
      </section>

      <section className="portal__form">
        <header className="portal__top">
          <button type="button" className="portal__brand" onClick={onBack}>
            <img src="/logo-enlinea-mark.png" alt="" />
            <img src="/logo-enlinea-text.png" alt="Alianza en líne@" />
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
            <span>Tipo de documento <i>*</i></span>
            <select value={docType} onChange={(event) => setDocType(event.target.value)}>
              {DOCS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Número de documento <i>*</i></span>
            <input
              value={document}
              onChange={(event) => setDocument(event.target.value)}
              placeholder="Escriba el número de documento"
              autoComplete="username"
            />
          </label>

          <label>
            <span>Contraseña <i>*</i></span>
            <span className="portal__pass">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingrese la contraseña"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword((open) => !open)} aria-label="Mostrar contraseña">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5C7.9 5 4.1 7.91 2.08 13a16.5 16.5 0 0 0 19.84 0C19.9 7.91 16.1 5 12 5Zm0 12a6 6 0 1 1 6-6 6 6 0 0 1-6 6Zm0-9a3 3 0 1 0 3 3 3 3 0 0 0-3-3Z" />
                </svg>
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

          <button type="submit" className={`portal__submit ${ready ? "is-ready" : ""}`} disabled={!ready || loading}>
            Ingrese
          </button>

          <p className="portal__account">¿No tiene cuenta?</p>
          <button type="button" className="portal__register">
            Regístrese
          </button>
          <p className="portal__note">Este registro solo es válido para Persona Natural.</p>
        </form>
      </section>

      {loading ? (
        <div className="portal__loader" role="status" aria-live="polite">
          <span className="portal__spinner" />
          <span className="sr-only">Cargando</span>
        </div>
      ) : null}
    </div>
  )
}
