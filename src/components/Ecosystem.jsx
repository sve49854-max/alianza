const SERVICES = [
  { title: "Descargar certificados tributarios", icon: "cert" },
  { title: "Administrar sus recaudos", icon: "pse" },
  { title: "Aportes plan institucional y descuentos de nómina", icon: "truck" },
  { title: "Administrar finanzas diarias", icon: "cal" },
  { title: "Inscribir titularización Tmas-1", icon: "gem" },
  { title: "Comprar y vender dólares", icon: "fx" },
  { title: "Proteger su patrimonio", icon: "safe" },
  { title: "Invertir en el exterior", icon: "globe" },
  { title: "Pagar servicios públicos", icon: "plug" },
  { title: "Fondos alternativos", icon: "alt" },
]

export default function Ecosystem({ onNavigate }) {
  return (
    <section className="eco">
      <div className="wrap">
        <p className="kicker">Gestione su patrimonio con</p>
        <h2>el ecosistema Alianza</h2>
        <p className="lead">
          Somos líderes en el sector financiero, ofreciendo soluciones integrales para inversión,
          manejo de patrimonio y optimización financiera a personas y empresas. Con plataformas
          digitales seguras y asesoría personalizada, garantizamos una gestión eficiente y
          confiable para alcanzar sus objetivos financieros.
        </p>
        <div className="eco__grid">
          {SERVICES.map((service) => (
            <button key={service.title} type="button" className="eco-card" onClick={() => onNavigate("que-hacemos")}>
              <Icon name={service.icon} />
              <span>{service.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function Icon({ name }) {
  return (
    <svg className="eco-card__icon" viewBox="0 0 48 48" aria-hidden="true">
      {name === "cert" && (
        <>
          <rect x="12" y="8" width="24" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M18 18h12M18 24h12M18 30h7" stroke="currentColor" strokeWidth="2" />
          <circle cx="31" cy="33" r="6" fill="#d6e34c" />
          <path d="M29 33h4M31 31v4" stroke="#16345a" strokeWidth="1.6" />
        </>
      )}
      {name === "pse" && (
        <text x="8" y="30" fontSize="16" fontWeight="800" fill="#f5a623">
          PSE
        </text>
      )}
      {name === "truck" && (
        <path
          d="M8 30h22V16H8v14Zm22 0h8l4-8h-12v8Zm-16 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm20 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      )}
      {name === "cal" && (
        <>
          <rect x="10" y="12" width="28" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M10 20h28M18 8v8M30 8v8" stroke="currentColor" strokeWidth="2" />
        </>
      )}
      {name === "gem" && (
        <path d="M24 8 36 20 24 40 12 20Z" fill="none" stroke="currentColor" strokeWidth="2" />
      )}
      {name === "fx" && (
        <>
          <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M18 24h12M24 16c3 0 5 2 5 8s-2 8-5 8-5-2-5-8 2-8 5-8Z" fill="none" stroke="currentColor" strokeWidth="2" />
        </>
      )}
      {name === "safe" && (
        <path d="M14 16h20v20H14V16Zm8 10a4 4 0 1 0 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
      )}
      {name === "globe" && (
        <>
          <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M12 24h24M24 12c4 4 6 8 6 12s-2 8-6 12c-4-4-6-8-6-12s2-8 6-12Z" fill="none" stroke="currentColor" strokeWidth="2" />
        </>
      )}
      {name === "plug" && (
        <path d="M18 10v8h12v-8M16 18h16v8a8 8 0 0 1-16 0v-8Zm8 16v6" fill="none" stroke="currentColor" strokeWidth="2" />
      )}
      {name === "alt" && <path d="M24 8 38 38H10Z" fill="none" stroke="currentColor" strokeWidth="2" />}
    </svg>
  )
}
