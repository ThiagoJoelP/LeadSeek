# LeadSeek

Herramienta de prospección geográfica de contactos profesionales y negocios.

## Stack

- React 18 + Vite
- Leaflet.js (mapa, tiles CARTO dark — gratuito)
- Google Places API (búsqueda real de negocios)
- xlsx (exportación a Excel/CSV)
- Deploy: Vercel (auto desde GitHub)

## Setup local

```bash
npm install
cp .env.example .env.local
# Editá .env.local con tu API Key de Google
npm run dev
```

## Configurar Google Places API

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear o seleccionar un proyecto
3. Habilitar **Places API** y **Geocoding API**
4. Crear una API Key en "Credenciales"
5. Pegarla en `.env.local`:

```
VITE_GOOGLE_PLACES_API_KEY=AIza...
```

**En Vercel**: agregar la variable `VITE_GOOGLE_PLACES_API_KEY` en Settings > Environment Variables.

Sin API Key, la app corre en **modo demo** con datos simulados.

## Funcionalidades

- Búsqueda por keyword + zona (ciudad, provincia, país, radio km)
- Mapa interactivo dark con marcadores
- Panel de resultados con metadata
- Exportación CSV (UTF-8 con BOM) y XLSX
- Click en resultado → zoom al marcador en mapa

## Próximas features planeadas

- Paginación de resultados (Places API devuelve hasta 60 por búsqueda)
- Búsqueda de presencia digital (redes sociales, grupos)
- Filtros por rating, estado (abierto/cerrado)
- Historial de búsquedas
- Selección de zona por rectángulo dibujado en mapa
