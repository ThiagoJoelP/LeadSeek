import { useState } from 'react'

const LOCATION_MODES = [
  { value: 'city', label: 'Ciudad' },
  { value: 'province', label: 'Provincia' },
  { value: 'country', label: 'País' },
  { value: 'radius', label: 'Radio (km)' },
]

const SUGGESTED_KEYWORDS = [
  'fonoaudiología', 'psicólogo', 'odontólogo', 'nutricionista',
  'carpintería', 'plomero', 'electricista', 'veterinaria',
  'gym', 'estudio contable', 'farmacia', 'kinesiólogo',
]

export default function SearchPanel({ onSearch, loading }) {
  const [keyword, setKeyword] = useState('')
  const [locationMode, setLocationMode] = useState('city')
  const [locationLabel, setLocationLabel] = useState('')
  const [radiusKm, setRadiusKm] = useState(5)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!keyword.trim() || !locationLabel.trim()) return
    onSearch({
      keyword: keyword.trim(),
      locationMode,
      locationLabel: locationLabel.trim(),
      radiusKm: Number(radiusKm),
    })
  }

  const applyKeyword = (kw) => setKeyword(kw)

  return (
    <div className="search-panel">
      <div className="panel-label">// BÚSQUEDA</div>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="field-group">
          <label className="field-label">RUBRO / PALABRA CLAVE</label>
          <input
            className="field-input"
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="ej: fonoaudiología, carpintería..."
            required
          />
          <div className="keyword-chips">
            {SUGGESTED_KEYWORDS.map(kw => (
              <button
                key={kw}
                type="button"
                className={`chip ${keyword === kw ? 'chip-active' : ''}`}
                onClick={() => applyKeyword(kw)}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">MODO DE ZONA</label>
          <div className="mode-tabs">
            {LOCATION_MODES.map(m => (
              <button
                key={m.value}
                type="button"
                className={`mode-tab ${locationMode === m.value ? 'mode-tab-active' : ''}`}
                onClick={() => setLocationMode(m.value)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">
            {locationMode === 'city' && 'CIUDAD'}
            {locationMode === 'province' && 'PROVINCIA'}
            {locationMode === 'country' && 'PAÍS'}
            {locationMode === 'radius' && 'UBICACIÓN BASE'}
          </label>
          <input
            className="field-input"
            type="text"
            value={locationLabel}
            onChange={e => setLocationLabel(e.target.value)}
            placeholder={
              locationMode === 'city' ? 'ej: Córdoba, Argentina' :
              locationMode === 'province' ? 'ej: Provincia de Córdoba' :
              locationMode === 'country' ? 'ej: Argentina' :
              'ej: Cosquín, Córdoba'
            }
            required
          />
        </div>

        {locationMode === 'radius' && (
          <div className="field-group">
            <label className="field-label">RADIO: {radiusKm} km</label>
            <input
              className="field-range"
              type="range"
              min="1"
              max="50"
              value={radiusKm}
              onChange={e => setRadiusKm(e.target.value)}
            />
            <div className="range-labels">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`btn-search ${loading ? 'btn-loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              BUSCANDO...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              BUSCAR LEADS
            </>
          )}
        </button>
      </form>
    </div>
  )
}
