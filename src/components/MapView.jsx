import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons for Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const ACCENT_ICON = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z" fill="#aaff00"/>
      <circle cx="12" cy="12" r="5" fill="#0a0a0a"/>
    </svg>
  `),
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
})

const SELECTED_ICON = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="44" viewBox="0 0 30 44">
      <path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 29 15 29s15-17.75 15-29C30 6.716 23.284 0 15 0z" fill="#ffffff"/>
      <circle cx="15" cy="15" r="6" fill="#0a0a0a"/>
    </svg>
  `),
  iconSize: [30, 44],
  iconAnchor: [15, 44],
  popupAnchor: [0, -44],
})

export default function MapView({ results, center, zoom, selectedLead, onSelectLead }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (mapInstanceRef.current) return
    mapInstanceRef.current = L.map(mapRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
    })
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current)
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    mapInstanceRef.current.setView(center, zoom, { animate: true })
  }, [center, zoom])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    results.forEach((lead) => {
      const marker = L.marker([lead.lat, lead.lng], { icon: ACCENT_ICON })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="font-family:'Space Mono',monospace;font-size:11px;color:#0a0a0a;min-width:180px;">
            <div style="font-weight:700;margin-bottom:4px;font-size:12px;">${lead.name}</div>
            <div style="color:#444;margin-bottom:4px;">${lead.address}</div>
            ${lead.phone ? `<div>📞 ${lead.phone}</div>` : ''}
            ${lead.rating ? `<div>★ ${lead.rating} (${lead.totalRatings} reseñas)</div>` : ''}
            ${lead.website ? `<div><a href="${lead.website}" target="_blank" style="color:#0066cc;">Ver sitio ↗</a></div>` : ''}
          </div>
        `, { maxWidth: 260 })
        .on('click', () => onSelectLead(lead))
      markersRef.current.push(marker)
    })
  }, [results])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    markersRef.current.forEach((m, i) => {
      const lead = results[i]
      if (!lead) return
      m.setIcon(selectedLead?.id === lead.id ? SELECTED_ICON : ACCENT_ICON)
      if (selectedLead?.id === lead.id) {
        m.openPopup()
        mapInstanceRef.current.setView([lead.lat, lead.lng], 15, { animate: true })
      }
    })
  }, [selectedLead])

  return (
    <div className="map-container">
      <div ref={mapRef} className="map-inner" />
      <div className="map-overlay-info">
        <span>{results.length > 0 ? `${results.length} leads en mapa` : 'Sin datos — ejecutá una búsqueda'}</span>
      </div>
    </div>
  )
}
