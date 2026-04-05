import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import axios from 'axios'
import io from 'socket.io-client'
import 'leaflet/dist/leaflet.css'

const socket = io('https://disaster-aid-hnwq.onrender.com')

const needIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
})

const offerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
})

const urgencyColor = { low: '#4ade80', medium: '#facc15', high: '#fb923c', critical: '#ef4444' }

function FlyTo({ coords }) {
  const map = useMap()
  useEffect(() => { if (coords) map.flyTo(coords, 14, { duration: 1.5 }) }, [coords])
  return null
}

function Map() {
  const [needs, setNeeds] = useState([])
  const [offers, setOffers] = useState([])
  const [selected, setSelected] = useState(null)
  const [flyTo, setFlyTo] = useState(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('https://disaster-aid-hnwq.onrender.com/api/needs'),
      axios.get('https://disaster-aid-hnwq.onrender.com/api/offers')
    ]).then(([n, o]) => {
      setNeeds(n.data)
      setOffers(o.data)
      setLoading(false)
    })
    socket.on('newNeed', n => setNeeds(p => [n, ...p]))
    socket.on('newOffer', o => setOffers(p => [o, ...p]))
    socket.on('updateNeed', u => setNeeds(p => p.map(n => n._id === u._id ? u : n)))
    return () => { socket.off('newNeed'); socket.off('newOffer'); socket.off('updateNeed') }
  }, [])

  const allItems = [
    ...needs.map(n => ({ ...n, _kind: 'need' })),
    ...offers.map(o => ({ ...o, _kind: 'offer' }))
  ]

  const filtered = filter === 'all' ? allItems
    : filter === 'needs' ? allItems.filter(i => i._kind === 'need')
    : allItems.filter(i => i._kind === 'offer')

  const critical = needs.filter(n => n.urgency === 'critical' && n.status === 'open').length

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, height: '75vh' }}>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>

        {/* Stats */}
        <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {[
              { label: 'Needs', value: needs.length, color: '#ef4444' },
              { label: 'Offers', value: offers.length, color: '#4ade80' },
              { label: 'Critical', value: critical, color: '#f97316' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '10px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.68rem', color: '#475569', letterSpacing: '1px', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div style={{ padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 6 }}>
          {['all', 'needs', 'offers'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, textTransform: 'capitalize',
              background: filter === f ? '#dc2626' : 'rgba(255,255,255,0.05)',
              color: filter === f ? 'white' : '#475569'
            }}>{f}</button>
          ))}
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading ? (
            [1,2,3,4].map(i => (
              <div key={i} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ height: 12, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 8, width: '60%' }}></div>
                <div style={{ height: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 4, width: '80%' }}></div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#334155' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📭</div>
              <div style={{ fontSize: '0.85rem' }}>No posts yet</div>
            </div>
          ) : filtered.map(item => (
            <div key={item._id} onClick={() => { setSelected(item); setFlyTo([item.location.lat, item.location.lng]) }}
              style={{
                padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer',
                background: selected?._id === item._id ? 'rgba(220,38,38,0.08)' : 'transparent',
                borderLeft: `3px solid ${item._kind === 'need' ? (urgencyColor[item.urgency] || '#ef4444') : '#4ade80'}`,
                transition: 'background 0.15s'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.type}</span>
                <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 10, background: item._kind === 'need' ? 'rgba(220,38,38,0.15)' : 'rgba(74,222,128,0.15)', color: item._kind === 'need' ? '#f87171' : '#4ade80' }}>
                  {item._kind === 'need' ? 'NEED' : 'OFFER'}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</div>
              <div style={{ fontSize: '0.72rem', color: '#334155' }}>📍 {item.location?.address || 'Location not specified'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
        <MapContainer center={[17.385, 78.4867]} zoom={12} style={{ height: '100%', width: '100%' }} maxBounds={[[-90,-180],[90,180]]} maxBoundsViscosity={1.0}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' noWrap={true}/>
          {flyTo && <FlyTo coords={flyTo} />}
          {needs.map(n => n.location?.lat && (
            <Marker key={n._id} position={[n.location.lat, n.location.lng]} icon={needIcon}>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <strong style={{ color: '#dc2626' }}>{n.type.toUpperCase()}</strong>
                  <div style={{ margin: '6px 0', fontSize: '0.85rem' }}>{n.description}</div>
                  <div style={{ fontSize: '0.78rem', color: '#666' }}>👤 {n.postedBy} · 📞 {n.contact}</div>
                  <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                    <span style={{ padding: '2px 8px', background: urgencyColor[n.urgency] + '33', color: urgencyColor[n.urgency], borderRadius: 4, fontSize: '0.75rem' }}>{n.urgency}</span>
                    <span style={{ padding: '2px 8px', background: '#f1f5f9', borderRadius: 4, fontSize: '0.75rem', color: '#334155' }}>{n.status}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          {offers.map(o => o.location?.lat && (
            <Marker key={o._id} position={[o.location.lat, o.location.lng]} icon={offerIcon}>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <strong style={{ color: '#16a34a' }}>{o.type.toUpperCase()} — OFFER</strong>
                  <div style={{ margin: '6px 0', fontSize: '0.85rem' }}>{o.description}</div>
                  <div style={{ fontSize: '0.78rem', color: '#666' }}>👤 {o.postedBy} · 📞 {o.contact}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

export default Map