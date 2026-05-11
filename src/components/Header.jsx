export default function Header() {
  return (
    <header className="app-header">
      <div className="header-logo">
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <circle cx="14" cy="13" r="7" stroke="#aaff00" strokeWidth="2" fill="none"/>
          <circle cx="14" cy="13" r="2.5" fill="#aaff00"/>
          <line x1="14" y1="20" x2="14" y2="28" stroke="#aaff00" strokeWidth="2"/>
          <line x1="19" y1="18" x2="28" y2="27" stroke="#aaff00" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        <span className="header-brand">LEAD<span className="brand-accent">SEEK</span></span>
      </div>
      <div className="header-tagline">Prospección geográfica de contactos profesionales</div>
      <div className="header-status">
        <span className="status-dot"></span>
        <span>MODO DEMO — Configurá tu API Key para resultados reales</span>
      </div>
    </header>
  )
}
