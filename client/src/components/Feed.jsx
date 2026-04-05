import { useEffect, useState } from 'react'
import axios from 'axios'
import io from 'socket.io-client'

const socket = io('https://disaster-aid-hnwq.onrender.com')

const urgency = {
  low: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  high: { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)' },
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
}

const typeIcon = { food: '🍱', water: '💧', shelter: '🏠', medical: '🩺', rescue: '🚨' }

function Skeleton() {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 12 }}>
      {[['40%',14],['75%',11],['55%',11]].map(([w,h],i) => (
        <div key={i} style={{ height: h, background: 'var(--bg3)', borderRadius: 4, width: w, marginBottom: i < 2 ? 10 : 0 }}></div>
      ))}
    </div>
  )
}

function NeedCard({ n, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ description: n.description, quantity: n.quantity || '', urgency: n.urgency })
  const u = urgency[n.urgency] || urgency.medium

  const saveEdit = async () => {
    await axios.patch(`https://disaster-aid-hnwq.onrender.com/api/needs/${n._id}`, editForm)
    setEditing(false)
  }

  return (
    <div style={{ background: 'var(--bg2)', border: `1px solid var(--border)`, borderRadius: 'var(--radius)', padding: 20, marginBottom: 12, borderLeft: `3px solid ${u.color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, background: u.bg, border: `1px solid ${u.border}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{typeIcon[n.type]}</div>
          <div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{n.type}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 1 }}>{new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span style={{ padding: '3px 10px', background: u.bg, color: u.color, border: `1px solid ${u.border}`, borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>{n.urgency}</span>
          <span style={{ padding: '3px 10px', background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600 }}>{n.status}</span>
          <button onClick={() => setEditing(!editing)} style={{ padding: '4px 12px', background: 'var(--blue-bg)', border: '1px solid var(--blue-border)', borderRadius: 7, color: 'var(--blue2)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✏️ Edit</button>
          <button onClick={() => onDelete(n._id)} style={{ padding: '4px 12px', background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 7, color: 'var(--red)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>🗑️ Delete</button>
        </div>
      </div>

      {editing ? (
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})}
              style={{ width: '100%', padding: '9px 12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.88rem', resize: 'vertical', height: 80, fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Quantity</label>
              <input value={editForm.quantity} onChange={e => setEditForm({...editForm, quantity: e.target.value})}
                style={{ width: '100%', padding: '9px 12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.88rem', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Urgency</label>
              <select value={editForm.urgency} onChange={e => setEditForm({...editForm, urgency: e.target.value})}
                style={{ width: '100%', padding: '9px 12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.88rem', fontFamily: 'inherit' }}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={saveEdit} style={{ padding: '7px 18px', background: 'var(--blue)', border: 'none', borderRadius: 8, color: 'white', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Save Changes</button>
            <button onClick={() => setEditing(false)} style={{ padding: '7px 18px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text3)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          </div>
        </div>
      ) : (
        <p style={{ color: 'var(--text2)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: 12 }}>{n.description}</p>
      )}

      {n.quantity && !editing && <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 8 }}>📦 {n.quantity}</div>}
      {n.photo && <img src={n.photo} alt="" style={{ width: '100%', borderRadius: 10, marginBottom: 12, maxHeight: 200, objectFit: 'cover' }} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text3)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span>👤 {n.postedBy}</span>
          <span>📞 {n.contact}</span>
          <span>📍 {n.location?.address}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {n.status === 'open' && <button onClick={() => onUpdate(n._id, 'inprogress')} style={{ padding: '5px 14px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 7, color: '#f97316', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>In Progress</button>}
          {n.status === 'inprogress' && <button onClick={() => onUpdate(n._id, 'resolved')} style={{ padding: '5px 14px', background: 'var(--green-bg)', border: '1px solid var(--green-border)', borderRadius: 7, color: 'var(--green)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✓ Resolved</button>}
        </div>
      </div>
    </div>
  )
}

function OfferCard({ o, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ description: o.description, capacity: o.capacity || '' })

  const saveEdit = async () => {
    await axios.patch(`https://disaster-aid-hnwq.onrender.com/api/offers/${o._id}`, editForm)
    setEditing(false)
  }

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 12, borderLeft: '3px solid var(--green)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, background: 'var(--green-bg)', border: '1px solid var(--green-border)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{typeIcon[o.type]}</div>
          <div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{o.type}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 1 }}>{new Date(o.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ padding: '3px 10px', background: 'var(--green-bg)', color: 'var(--green)', border: '1px solid var(--green-border)', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700 }}>OFFER</span>
          <button onClick={() => setEditing(!editing)} style={{ padding: '4px 12px', background: 'var(--blue-bg)', border: '1px solid var(--blue-border)', borderRadius: 7, color: 'var(--blue2)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✏️ Edit</button>
          <button onClick={() => onDelete(o._id)} style={{ padding: '4px 12px', background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 7, color: 'var(--red)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>🗑️ Delete</button>
        </div>
      </div>

      {editing ? (
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})}
              style={{ width: '100%', padding: '9px 12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.88rem', resize: 'vertical', height: 80, fontFamily: 'inherit' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Capacity</label>
            <input value={editForm.capacity} onChange={e => setEditForm({...editForm, capacity: e.target.value})}
              style={{ width: '100%', padding: '9px 12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.88rem', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={saveEdit} style={{ padding: '7px 18px', background: 'var(--blue)', border: 'none', borderRadius: 8, color: 'white', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Save Changes</button>
            <button onClick={() => setEditing(false)} style={{ padding: '7px 18px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text3)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          </div>
        </div>
      ) : (
        <p style={{ color: 'var(--text2)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: 12 }}>{o.description}</p>
      )}

      {o.capacity && !editing && <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 8 }}>📦 {o.capacity}</div>}
      {o.photo && <img src={o.photo} alt="" style={{ width: '100%', borderRadius: 10, marginBottom: 12, maxHeight: 200, objectFit: 'cover' }} />}

      <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text3)', display: 'flex', gap: 12 }}>
        <span>👤 {o.postedBy}</span>
        <span>📞 {o.contact}</span>
        <span>📍 {o.location?.address}</span>
      </div>
    </div>
  )
}

export default function Feed() {
  const [needs, setNeeds] = useState([])
  const [offers, setOffers] = useState([])
  const [tab, setTab] = useState('needs')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([axios.get('https://disaster-aid-hnwq.onrender.com/api/needs'), axios.get('https://disaster-aid-hnwq.onrender.com/api/offers')])
      .then(([n,o]) => { setNeeds(n.data); setOffers(o.data); setLoading(false) })
    socket.on('newNeed', n => setNeeds(p => [n,...p]))
    socket.on('newOffer', o => setOffers(p => [o,...p]))
    socket.on('updateNeed', u => setNeeds(p => p.map(n => n._id===u._id ? u : n)))
    return () => { socket.off('newNeed'); socket.off('newOffer'); socket.off('updateNeed') }
  }, [])

  const updateStatus = (id, status) => axios.patch(`https://disaster-aid-hnwq.onrender.com/api/needs/${id}/status`, { status })

  const deleteNeed = async (id) => {
    if (!confirm('Delete this need?')) return
    await axios.delete(`https://disaster-aid-hnwq.onrender.com/api/needs/${id}`)
    setNeeds(p => p.filter(n => n._id !== id))
  }

  const deleteOffer = async (id) => {
    if (!confirm('Delete this offer?')) return
    await axios.delete(`https://disaster-aid-hnwq.onrender.com/api/offers/${id}`)
    setOffers(p => p.filter(o => o._id !== id))
  }

  const stats = [
    { label: 'Total Needs', value: needs.length, color: 'var(--blue)', icon: '🆘' },
    { label: 'Open', value: needs.filter(n=>n.status==='open').length, color: 'var(--orange)', icon: '🔓' },
    { label: 'Critical', value: needs.filter(n=>n.urgency==='critical'&&n.status==='open').length, color: 'var(--red)', icon: '🚨' },
    { label: 'Resolved', value: needs.filter(n=>n.status==='resolved').length, color: 'var(--green)', icon: '✅' },
  ]

  const filtered = filter === 'all' ? needs : filter === 'open' ? needs.filter(n=>n.status==='open') : filter === 'critical' ? needs.filter(n=>n.urgency==='critical') : needs.filter(n=>n.status==='resolved')

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
            <div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.7rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 4, borderRadius: 10, border: '1px solid var(--border)' }}>
          <button onClick={() => setTab('needs')} style={{ padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem', background: tab==='needs' ? 'var(--blue)' : 'transparent', color: tab==='needs' ? 'white' : 'var(--text3)' }}>Needs ({needs.length})</button>
          <button onClick={() => setTab('offers')} style={{ padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem', background: tab==='offers' ? 'var(--green)' : 'transparent', color: tab==='offers' ? 'white' : 'var(--text3)' }}>Offers ({offers.length})</button>
        </div>
        {tab === 'needs' && (
          <div style={{ display: 'flex', gap: 6 }}>
            {['all','open','critical','resolved'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 14px', borderRadius: 20, border: '1px solid', borderColor: filter===f ? 'var(--blue-border)' : 'var(--border)', background: filter===f ? 'var(--blue-bg)' : 'transparent', color: filter===f ? 'var(--blue2)' : 'var(--text3)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit' }}>{f}</button>
            ))}
          </div>
        )}
      </div>

      {loading ? [1,2,3].map(i => <Skeleton key={i} />) :
        tab === 'needs' ? (
          filtered.length === 0 ?
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: 6 }}>No needs found</div>
              <div style={{ fontSize: '0.85rem' }}>Try a different filter</div>
            </div> :
            filtered.map(n => <NeedCard key={n._id} n={n} onUpdate={updateStatus} onDelete={deleteNeed} />)
        ) : (
          offers.length === 0 ?
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🤝</div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: 6 }}>No offers yet</div>
              <div style={{ fontSize: '0.85rem' }}>Be the first to offer help</div>
            </div> :
            offers.map(o => <OfferCard key={o._id} o={o} onDelete={deleteOffer} />)
        )
      }
    </div>
  )
}