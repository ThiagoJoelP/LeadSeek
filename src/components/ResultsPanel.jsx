import * as XLSX from 'xlsx'

export default function ResultsPanel({ results, loading, searchMeta, selectedLead, onSelectLead }) {
  const exportCSV = () => {
    if (!results.length) return
    const rows = results.map(r => ({
      Nombre: r.name,
      Dirección: r.address,
      Teléfono: r.phone || '',
      Sitio_Web: r.website || '',
      Rating: r.rating || '',
      Valoraciones: r.totalRatings || '',
      Latitud: r.lat,
      Longitud: r.lng,
      Abierto_Ahora: r.openNow === true ? 'Sí' : r.openNow === false ? 'No' : '',
    }))
    const header = Object.keys(rows[0]).join(',')
    const body = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + header + '\n' + body], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leadseek_${searchMeta?.keyword || 'export'}_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportXLSX = () => {
    if (!results.length) return
    const rows = results.map(r => ({
      Nombre: r.name,
      'Dirección': r.address,
      'Teléfono': r.phone || '',
      'Sitio Web': r.website || '',
      Rating: r.rating || '',
      Valoraciones: r.totalRatings || '',
      Latitud: r.lat,
      Longitud: r.lng,
      'Abierto Ahora': r.openNow === true ? 'Sí' : r.openNow === false ? 'No' : '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Leads')
    XLSX.writeFile(wb, `leadseek_${searchMeta?.keyword || 'export'}_${Date.now()}.xlsx`)
  }

  return (
    <div className="results-panel">
      <div className="panel-label">// RESULTADOS</div>

      {searchMeta && (
        <div className="results-meta">
          <div className="meta-row">
            <span className="meta-key">BÚSQUEDA</span>
            <span className="meta-val">{searchMeta.keyword}</span>
          </div>
          <div className="meta-row">
            <span className="meta-key">ZONA</span>
            <span className="meta-val">{searchMeta.location}</span>
          </div>
          <div className="meta-row">
            <span className="meta-key">RESULTADOS</span>
            <span className="meta-val accent">{searchMeta.count}</span>
          </div>
          <div className="meta-row">
            <span className="meta-key">HORA</span>
            <span className="meta-val">{searchMeta.timestamp}</span>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="export-bar">
          <button className="btn-export" onClick={exportCSV}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            CSV
          </button>
          <button className="btn-export" onClick={exportXLSX}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            EXCEL
          </button>
        </div>
      )}

      {loading && (
        <div className="results-loading">
          <div className="loading-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        </div>
      )}

      {!loading && results.length === 0 && !searchMeta && (
        <div className="results-empty">
          <div className="empty-icon">◎</div>
          <div>Ingresá una palabra clave y zona para comenzar la prospección</div>
        </div>
      )}

      {!loading && results.length === 0 && searchMeta && (
        <div className="results-empty">
          <div className="empty-icon">∅</div>
          <div>Sin resultados para esta búsqueda</div>
        </div>
      )}

      <div className="results-list">
        {results.map((lead, i) => (
          <div
            key={lead.id}
            className={`lead-card ${selectedLead?.id === lead.id ? 'lead-card-active' : ''}`}
            onClick={() => onSelectLead(lead)}
          >
            <div className="lead-index">#{String(i + 1).padStart(2, '0')}</div>
            <div className="lead-body">
              <div className="lead-name">{lead.name}</div>
              <div className="lead-address">{lead.address}</div>
              <div className="lead-meta-row">
                {lead.rating && (
                  <span className="lead-badge badge-rating">
                    ★ {lead.rating} ({lead.totalRatings})
                  </span>
                )}
                {lead.phone && (
                  <span className="lead-badge badge-phone">{lead.phone}</span>
                )}
                {lead.website && (
                  <a
                    href={lead.website}
                    className="lead-badge badge-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                  >
                    WEB ↗
                  </a>
                )}
                {lead.openNow !== undefined && lead.openNow !== null && (
                  <span className={`lead-badge ${lead.openNow ? 'badge-open' : 'badge-closed'}`}>
                    {lead.openNow ? '● ABIERTO' : '○ CERRADO'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
