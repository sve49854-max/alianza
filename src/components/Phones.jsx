export default function Phones() {
  return (
    <div className="phones" aria-hidden="true">
      <article className="phone phone--left">
        <PhoneChrome title="Productos">
          <div className="app-search">Buscar producto</div>
          <FundRow name="Abierto Alianza" amount="$42 M" />
          <FundRow name="Fondo Cash" amount="$18 M" />
          <FundRow name="Renta Fija 90" amount="$9,4 M" />
        </PhoneChrome>
      </article>

      <article className="phone phone--center">
        <PhoneChrome title="Productos" highlight>
          <div className="fund-card">
            <span>ABIERTO ALIANZA GOBIERNO</span>
            <strong>$100 M</strong>
            <small>Saldo disponible</small>
          </div>
          <div className="aporte">
            <p>Aportes</p>
            <div className="aporte__row">
              <em>PSE</em>
              <em>REGISTRO APORTE BANCARIO</em>
            </div>
          </div>
        </PhoneChrome>
      </article>

      <article className="phone phone--right">
        <PhoneChrome title="Token">
          <div className="token">
            <small>Clave dinámica</small>
            <strong>384 209</strong>
            <span>Válida por 28 segundos</span>
          </div>
        </PhoneChrome>
      </article>
    </div>
  )
}

function PhoneChrome({ title, highlight, children }) {
  return (
    <div className={`phone__frame ${highlight ? "is-highlight" : ""}`}>
      <div className="phone__notch" />
      <div className="phone__screen">
        <header className="app-top">
          <b>{title}</b>
          <i />
        </header>
        {children}
        <nav className="app-nav">
          <span>Inicio</span>
          <span className="is-on">Productos</span>
          <span>Token</span>
          <span>Menú</span>
        </nav>
      </div>
    </div>
  )
}

function FundRow({ name, amount }) {
  return (
    <div className="fund-row">
      <span>{name}</span>
      <strong>{amount}</strong>
    </div>
  )
}
