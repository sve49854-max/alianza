const CHANNELS = [
  {
    title: "Preguntas frecuentes",
    text: "Consulte las preguntas frecuentes",
    icon: "faq",
  },
  {
    title: "Puntos de atención",
    text: "Conozca nuestros puntos de atención",
    icon: "pin",
  },
  {
    title: "Encontrémonos",
    text: "Priorizamos la atención según su necesidad",
    icon: "hands",
  },
]

export default function Contact({ onNavigate }) {
  return (
    <section className="contact" id="contacto">
      <div className="contact__inner">
        <p className="section-kicker">Contáctese con</p>
        <h2>nosotros</h2>
        <div className="contact__grid">
          {CHANNELS.map((channel) => (
            <button
              key={channel.title}
              type="button"
              className="channel"
              onClick={() => onNavigate("atencion")}
            >
              <span className="channel__icon">
                {channel.icon === "faq" && <FaqIcon />}
                {channel.icon === "pin" && <PinIcon />}
                {channel.icon === "hands" && <HandsIcon />}
              </span>
              <strong>{channel.title}</strong>
              <span>{channel.text}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M18 14h28a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H34l-10 8v-8h-6a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <circle cx="32" cy="38" r="1.7" fill="currentColor" />
      <path
        d="M26.5 26.4c.8-3.2 3.5-5 6.6-4.8 3.2.2 5.6 2.2 5.5 5.4 0 2.8-2.2 4-4.4 5.1-.9.5-1.6 1.2-1.6 2.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M32 10c9 0 16 7.2 16 16.4 0 11.6-16 27.6-16 27.6S16 38 16 26.4C16 17.2 23 10 32 10Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <circle cx="32" cy="26" r="6" fill="none" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  )
}

function HandsIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M12 36c4-1 8 2 10 6l3-14c.4-2 2.4-3 4.2-2.2 1.4.6 2 2.2 1.6 3.8L29 38h6.2l-1.4-12.4c-.3-2.2 1.2-4.2 3.4-4.4 2.1-.2 4 1.4 4.3 3.5L43 38c2.2-4 6.4-7 11-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 44c3.6 4.6 8.2 7 12 7s8.4-2.4 12-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}
