export default function Logo({ compact = false }) {
  return (
    <span className={`logo ${compact ? "logo--compact" : ""}`}>
      <svg className="logo__mark" viewBox="0 0 48 48" aria-hidden="true">
        <polygon points="24 4 10 42 24 33" fill="#1f6fbf" />
        <polygon points="24 4 38 42 24 33" fill="#d6e34c" />
        <polygon points="10 42 38 42 24 33" fill="#2aa57c" />
      </svg>
      <span className="logo__text">
        <strong>Alianza</strong>
        <small>40 Años</small>
      </span>
    </span>
  )
}
