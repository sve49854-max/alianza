import Phones from "./Phones"

const BENEFITS = [
  "Realice apertura de fondos",
  "Transfiera recursos entre fondos",
  "Incremente su rentabilidad",
]

export default function Hero({ onEnter }) {
  return (
    <section className="hero">
      <div className="hero__glow" />
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">Controle sus finanzas en</p>
          <h1>Alianza en línea</h1>
          <ul>
            {BENEFITS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <button type="button" className="cta" onClick={onEnter}>
            Ingrese ahora
          </button>
        </div>
        <Phones />
      </div>
    </section>
  )
}
