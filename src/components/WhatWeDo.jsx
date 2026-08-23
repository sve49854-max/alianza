import { useState } from "react"

const TABS = {
  INVERSIONES: {
    personas: [
      {
        title: "Manejo de sus finanzas diarias",
        text: "Invierta sus recursos líquidos en un vehículo más eficiente en términos de retornos y diversificación, con alta capacidad transaccional y con el acompañamiento de su asesor de inversiones.",
        links: ["Giros al Exterior", "Apertura en línea de fondos", "Transferencias electrónicas y pagos PSE"],
      },
      {
        title: "Diversificación de sus inversiones",
        text: "Construimos objetivos acompañados de una estrategia de inversión que busca capturar el mejor retorno, según riesgo, horizonte y perfil.",
        links: ["Portafolios en Pensión Voluntaria", "Fondo Renta Fija 90"],
      },
    ],
    empresas: [
      {
        title: "Gestión de tesorería",
        text: "Maximice el flujo del dinero a través de Fondos de Inversión Colectiva transaccionales.",
        links: ["Fondo Abierto Alianza", "Fondo Cash Conservador", "Fondo CxC"],
      },
      {
        title: "Gestión de portafolio",
        text: "Diversifique excedentes de liquidez en vehículos alternativos, renta fija, renta variable y mercado cambiario.",
        links: ["Alianza Corp - RIA"],
      },
    ],
  },
  FIDUCIA: {
    personas: [
      {
        title: "Protección del patrimonio propio y familiar",
        text: "Fideicomisos y encargos fiduciarios para separar bienes, protegerlos y destinarlos a un objetivo concreto.",
        links: ["Fiducia de Administración y Pagos"],
      },
      {
        title: "Esquemas de fiducia sucesoral",
        text: "Consolide los bienes de la futura sucesión y establezca reglas claras para su administración.",
        links: ["Fiducia de Administración y Pagos"],
      },
    ],
    empresas: [
      {
        title: "Administración y pagos sobre activos empresariales",
        text: "Esquemas fiduciarios para regular el manejo de activos con destinación específica.",
        links: ["Fiducia de Administración y Pagos"],
      },
      {
        title: "Fiducia inmobiliaria para el desarrollo de proyectos",
        text: "Fideicomisos para preventa y construcción de proyectos inmobiliarios.",
        links: ["Fiducia Inmobiliaria"],
      },
    ],
  },
}

export default function WhatWeDo() {
  const [tab, setTab] = useState("INVERSIONES")
  const groups = TABS[tab]

  return (
    <section className="work">
      <div className="wrap">
        <p className="kicker">Lo que hacemos</p>
        <h2>por usted</h2>
        <p className="lead">
          Ponemos a su disposición una variedad de productos segmentados para ayudarle a alcanzar
          sus metas, desde planificar la jubilación hasta construir un fondo de emergencia.
        </p>
        <div className="work__tabs">
          {Object.keys(TABS).map((name) => (
            <button key={name} type="button" className={tab === name ? "is-on" : ""} onClick={() => setTab(name)}>
              {name}
            </button>
          ))}
        </div>
        <div className="work__cols">
          <Column title="Personas" items={groups.personas} />
          <Column title="Empresas" items={groups.empresas} />
        </div>
      </div>
    </section>
  )
}

function Column({ title, items }) {
  return (
    <div className="work-col">
      <h3>{title}</h3>
      {items.map((item) => (
        <article key={item.title} className="work-card">
          <h4>{item.title}</h4>
          <p>{item.text}</p>
          <ul>
            {item.links.map((link) => (
              <li key={link}>{link}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}
