import { useState } from 'react'
import Header from './components/Header.jsx'
import SearchPanel from './components/SearchPanel.jsx'
import ResultsPanel from './components/ResultsPanel.jsx'
import MapView from './components/MapView.jsx'
import './styles/app.css'

export default function App() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mapCenter, setMapCenter] = useState([-34.6037, -58.3816]) // Buenos Aires default
  const [mapZoom, setMapZoom] = useState(12)
  const [selectedLead, setSelectedLead] = useState(null)
  const [searchMeta, setSearchMeta] = useState(null)

  const handleSearch = async (searchParams) => {
    setLoading(true)
    setError(null)
    setResults([])
    setSelectedLead(null)

    try {
      const data = await searchPlaces(searchParams)
      setResults(data.results)
      setSearchMeta({
        keyword: searchParams.keyword,
        location: searchParams.locationLabel,
        count: data.results.length,
        timestamp: new Date().toLocaleString('es-AR'),
      })
      if (data.center) {
        setMapCenter([data.center.lat, data.center.lng])
        setMapZoom(13)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-root">
      <Header />
      <div className="app-body">
        <aside className="app-sidebar">
          <SearchPanel onSearch={handleSearch} loading={loading} />
          {error && (
            <div className="error-banner">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}
          <ResultsPanel
            results={results}
            loading={loading}
            searchMeta={searchMeta}
            selectedLead={selectedLead}
            onSelectLead={setSelectedLead}
          />
        </aside>
        <main className="app-map">
          <MapView
            results={results}
            center={mapCenter}
            zoom={mapZoom}
            selectedLead={selectedLead}
            onSelectLead={setSelectedLead}
          />
        </main>
      </div>
    </div>
  )
}

async function searchPlaces(params) {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY

  if (!apiKey || apiKey === 'your_api_key_here') {
    // Demo mode with mock data
    await new Promise(r => setTimeout(r, 1200))
    return generateMockData(params)
  }

  // Geocode the location string first
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(params.locationLabel)}&key=${apiKey}`
  const geoRes = await fetch(geocodeUrl)
  const geoData = await geoRes.json()

  if (!geoData.results?.length) throw new Error('No se pudo geocodificar la ubicacion.')

  const { lat, lng } = geoData.results[0].geometry.location
  const radiusMeters = (params.radiusKm || 5) * 1000

  const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&keyword=${encodeURIComponent(params.keyword)}&key=${apiKey}`
  const placesRes = await fetch(placesUrl)
  const placesData = await placesRes.json()

  if (placesData.status === 'REQUEST_DENIED') throw new Error('API Key invalida o Places API no habilitada.')

  const results = (placesData.results || []).map(p => ({
    id: p.place_id,
    name: p.name,
    address: p.vicinity || '',
    rating: p.rating || null,
    totalRatings: p.user_ratings_total || 0,
    types: p.types || [],
    lat: p.geometry.location.lat,
    lng: p.geometry.location.lng,
    phone: null,
    website: null,
    openNow: p.opening_hours?.open_now,
  }))

  return { results, center: { lat, lng } }
}

function generateMockData(params) {
  const mockNames = [
    'Centro Medico del Valle', 'Consultorio Profesional Norte', 'Estudio Integrado Sur',
    'Clinica San Martin', 'Consultorio Belgrano', 'Centro de Salud Palermo',
    'Instituto Moderno', 'Consultorios Rivadavia', 'Centro Profesional Alberdi',
    'Clinica del Parque', 'Estudio Central', 'Consultorio Las Heras',
  ]
  const mockAddresses = [
    'Av. Corrientes 1234', 'Mitre 567', 'San Martin 890', 'Rivadavia 234',
    'Belgrano 678', 'Independencia 1100', 'Tucuman 450', 'Lavalle 789',
  ]
  const baseLat = -34.6037
  const baseLng = -58.3816
  const count = Math.floor(Math.random() * 8) + 5

  const results = Array.from({ length: count }, (_, i) => ({
    id: `mock_${i}`,
    name: `${mockNames[i % mockNames.length]} - ${params.keyword}`,
    address: mockAddresses[i % mockAddresses.length] + `, ${params.locationLabel}`,
    rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    totalRatings: Math.floor(Math.random() * 200) + 5,
    types: ['health', 'establishment'],
    lat: baseLat + (Math.random() - 0.5) * 0.05,
    lng: baseLng + (Math.random() - 0.5) * 0.05,
    phone: `+54 9 11 ${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    website: Math.random() > 0.5 ? `https://www.ejemplo-${i}.com` : null,
    openNow: Math.random() > 0.3,
  }))

  return { results, center: { lat: baseLat, lng: baseLng } }
}
