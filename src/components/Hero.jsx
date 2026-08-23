import { useState } from "react"

const SLIDES = [
  {
    title: "Acompañando decisiones que importan",
  },
  {
    title: "Descargue sus certificados tributarios",
    actions: ["Descargar certificados", "Calendario tributario"],
  },
]

const STATS = [
  { value: "7.152", label: "Fideicomisos Administrados" },
  {
    value: "$20,8B",
    label: "En activos bajo administración en Fondos de Inversión Colectiva y Fondo de Pensiones Voluntarias",
  },
  { value: "$5,2B", label: "De portafolios de clientes de Renta Fija y acciones en Alianza Valores" },
  { value: "$13,5B", label: "Administrados en Fondos de capital privado" },
]

export default function Hero() {
  const [slide, setSlide] = useState(0)
  const current = SLIDES[slide]

  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__copy">
          <h1>{current.title}</h1>
          {current.actions && (
            <div className="hero__actions">
              {current.actions.map((label) => (
                <button key={label} type="button" className="ghost-link">
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="hero__years" aria-hidden="true" />
      </div>
      <div className="hero__dots">
        {SLIDES.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className={index === slide ? "is-on" : ""}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setSlide(index)}
          />
        ))}
      </div>
      <div className="stats">
        {STATS.map((item) => (
          <article key={item.value}>
            <strong>{item.value}</strong>
            <p>{item.label}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
