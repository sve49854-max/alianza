import Logo from "./Logo"

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <Logo compact />
          <p>Proyecto visual inspirado en la experiencia digital de Alianza.</p>
        </div>
        <div>
          <h3>Explorar</h3>
          <button type="button" onClick={() => onNavigate("nosotros")}>Nosotros</button>
          <button type="button" onClick={() => onNavigate("que-hacemos")}>Qué hacemos</button>
          <button type="button" onClick={() => onNavigate("educacion")}>Educación financiera</button>
        </div>
        <div>
          <h3>Ayuda</h3>
          <button type="button" onClick={() => onNavigate("atencion")}>Atención al cliente</button>
          <button type="button" onClick={() => onNavigate("blog")}>Blog</button>
        </div>
      </div>
    </footer>
  )
}
