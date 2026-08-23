const COPY = {
  nosotros: {
    kicker: "Quiénes somos",
    title: "40 años acompañando decisiones que importan",
    text: "Una mirada cercana al ecosistema Alianza: inversión, patrimonio y acompañamiento para personas y empresas.",
  },
  "que-hacemos": {
    kicker: "Qué hacemos",
    title: "Soluciones para personas y empresas",
    text: "Fondos, fiducia, portafolios y canales digitales para gestionar liquidez, diversificar e invertir con un propósito claro.",
  },
  educacion: {
    kicker: "Educación financiera",
    title: "Entender para decidir mejor",
    text: "Contenidos prácticos sobre fondos, riesgo, horizonte de inversión y cómo usar Alianza en línea con más confianza.",
  },
  atencion: {
    kicker: "Atención al cliente",
    title: "Estamos para resolverlo",
    text: "Preguntas frecuentes, puntos de atención y un equipo listo para contactarlo según lo que necesite.",
  },
  blog: {
    kicker: "Blog",
    title: "Historias y claves del mercado",
    text: "Artículos breves para seguir el contexto económico y las decisiones de inversión del día a día.",
  },
}

export default function InnerPage({ id }) {
  const page = COPY[id]

  if (!page) return null

  return (
    <section className="inner">
      <div className="inner__card">
        <p className="section-kicker">{page.kicker}</p>
        <h1>{page.title}</h1>
        <p>{page.text}</p>
      </div>
    </section>
  )
}
