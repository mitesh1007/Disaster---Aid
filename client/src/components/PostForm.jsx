import { useState } from 'react'
import axios from 'axios'

const labelStyle = {
  display: 'block', fontSize: '0.72rem', letterSpacing: '1.5px',
  textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 8, fontWeight: 500
}

const inputStyle = {
  width: '100%', padding: '11px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--border)',
  borderRadius: 10, color: 'var(--text)',
  fontSize: '0.9rem', outline: 'none',
  fontFamily: 'inherit'
}

const typeOptions = [
  { value: 'food', label: '🍱 Food' },
  { value: 'water', label: '💧 Water' },
  { value: 'shelter', label: '🏠 Shelter' },
  { value: 'medical', label: '🩺 Medical' },
  { value: 'rescue', label: '🚨 Rescue' },
]

const urgencyOptions = [
  { value: 'low', label: 'Low', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#f97316' },
  { value: 'critical', label: 'Critical', color: '#ef4444' },
]

function NeedForm() {
  const [form, setForm] = useState({
    type: 'food', description: '', quantity: '',
    urgency: 'medium', postedBy: '', contact: '',
    lat: '', lng: '', address: ''
  })
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [mlResult, setMlResult] = useState(null)
  const [mlLoading, setMlLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const classifyText = async (text) => {
    if (!text || text.length < 10) return
    setMlLoading(true)
    setMlResult(null)
    try {
      const res = await axios.post('https://disaster-aid-hnwq.onrender.com/api/ml/classify', { text })
      setMlResult(res.data)
      setForm(f => ({ ...f, urgency: res.data.urgency }))
    } catch (err) {
      console.log('ML error:', err)
    }
    setMlLoading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const data = {
        type: form.type, description: form.description,
        urgency: form.urgency, postedBy: form.postedBy,
        contact: form.contact,
        location: { lat: parseFloat(form.lat), lng: parseFloat(form.lng), address: form.address }
      }
      if (form.quantity) data.quantity = form.quantity
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))
      if (photo) formData.append('photo', photo)
      await axios.post('https://disaster-aid-hnwq.onrender.com/api/needs', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSuccess('Your need has been posted successfully.')
      setForm({ type: 'food', description: '', quantity: '', urgency: 'medium', postedBy: '', contact: '', lat: '', lng: '', address: '' })
      setPhoto(null)
      setMlResult(null)
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) { alert('Error: ' + err.message) }
    setLoading(false)
  }

  return (
    <div style={{ background: 'rgba(59,124,255,0.03)', border: '1px solid rgba(59,124,255,0.1)', borderRadius: 16, padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, background: 'rgba(59,124,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🆘</div>
        <div>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>Request Aid</div>
          <div style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>Describe your situation — AI will auto-detect severity</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>What do you need?</label>
          <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
            {typeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>How urgent?</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
            {urgencyOptions.map(u => (
              <button key={u.value} onClick={() => setForm({ ...form, urgency: u.value })} style={{
                padding: '8px 4px', borderRadius: 8, cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600,
                border: form.urgency === u.value ? `1px solid ${u.color}` : '1px solid var(--border)',
                background: form.urgency === u.value ? `${u.color}22` : 'transparent',
                color: form.urgency === u.value ? u.color : 'var(--text3)',
                fontFamily: 'inherit'
              }}>{u.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Describe your situation</label>
        <textarea
          name="description"
          placeholder="What happened? How many people are affected? What exactly do you need?"
          value={form.description}
          onChange={handleChange}
          onBlur={e => classifyText(e.target.value)}
          style={{ ...inputStyle, height: 100, resize: 'vertical' }}
        />
        {mlLoading && (
          <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--blue2)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 10, height: 10, border: '2px solid var(--blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
            AI analyzing severity...
          </div>
        )}
        {mlResult && !mlLoading && (
          <div style={{ marginTop: 8, background: 'var(--blue-bg)', border: '1px solid var(--blue-border)', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--blue2)' }}>
               AI detected: <strong style={{ color: 'var(--text)' }}>{mlResult.label}</strong>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
              {mlResult.confidence}% confidence → urgency set to <strong style={{ color: 'var(--text)' }}>{mlResult.urgency}</strong>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Quantity needed</label>
        <input name="quantity" placeholder="e.g. Food for 50 people, 20 water bottles" value={form.quantity} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>Your name / Organization</label>
          <input name="postedBy" placeholder="Full name or NGO" value={form.postedBy} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Contact number</label>
          <input name="contact" placeholder="+91 99999 99999" value={form.contact} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Location / Address</label>
        <input name="address" placeholder="Street, area, city" value={form.address} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>Latitude</label>
          <input name="lat" placeholder="e.g. 17.385" value={form.lat} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Longitude</label>
          <input name="lng" placeholder="e.g. 78.486" value={form.lng} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <button type="button" onClick={() => {
        navigator.geolocation.getCurrentPosition(
          pos => setForm(f => ({ ...f, lat: pos.coords.latitude.toFixed(5), lng: pos.coords.longitude.toFixed(5) })),
          () => alert('Location access denied')
        )
      }} style={{ width: '100%', padding: '10px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginBottom: 20, fontFamily: 'inherit' }}>
         Use My Current Location
      </button>

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Photo of situation (optional)</label>
        <div style={{ border: '2px dashed rgba(59,124,255,0.15)', borderRadius: 10, padding: '20px', textAlign: 'center', position: 'relative', cursor: 'pointer' }}>
          <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }} />
          <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>📷</div>
          <div style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>{photo ? `✅ ${photo.name}` : 'Upload a photo to verify the situation'}</div>
        </div>
      </div>

      {success && <div style={{ background: 'var(--green-bg)', border: '1px solid var(--green-border)', color: 'var(--green)', padding: '12px 16px', borderRadius: 10, marginBottom: 16, textAlign: 'center', fontSize: '0.88rem' }}>✅ {success}</div>}

      <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '15px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'var(--blue)', color: 'white', fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '1px', textTransform: 'uppercase', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 20px rgba(59,124,255,0.3)' }}>
        {loading ? 'Posting...' : 'Submit Aid Request →'}
      </button>
    </div>
  )
}

function OfferForm() {
  const [form, setForm] = useState({
    type: 'food', description: '', capacity: '',
    postedBy: '', contact: '', lat: '', lng: '', address: '', availableUntil: ''
  })
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const data = {
        type: form.type, description: form.description,
        capacity: form.capacity, postedBy: form.postedBy,
        contact: form.contact, urgency: 'low',
        location: { lat: parseFloat(form.lat), lng: parseFloat(form.lng), address: form.address }
      }
      if (form.availableUntil) data.availableUntil = form.availableUntil
      const formData = new FormData()
      formData.append('data', JSON.stringify(data))
      if (photo) formData.append('photo', photo)
      await axios.post('https://disaster-aid-hnwq.onrender.com/api/offers', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSuccess('Your offer is live. Nearby needs will be matched to you.')
      setForm({ type: 'food', description: '', capacity: '', postedBy: '', contact: '', lat: '', lng: '', address: '', availableUntil: '' })
      setPhoto(null)
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) { alert('Error: ' + err.message) }
    setLoading(false)
  }

  return (
    <div style={{ background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: 16, padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, background: 'rgba(16,185,129,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🤝</div>
        <div>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>Offer Help</div>
          <div style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>Tell us what you can provide — we'll connect you with those who need it</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>What can you offer?</label>
          <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
            {typeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Available until</label>
          <input type="datetime-local" name="availableUntil" value={form.availableUntil} onChange={handleChange} style={{ ...inputStyle, colorScheme: 'dark' }} />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Describe what you're offering</label>
        <textarea name="description" placeholder="What exactly can you provide?" value={form.description} onChange={handleChange} style={{ ...inputStyle, height: 100, resize: 'vertical' }} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Capacity / Quantity available</label>
        <input name="capacity" placeholder="e.g. Can feed 100 people, 50 water bottles" value={form.capacity} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>Your name / Organization</label>
          <input name="postedBy" placeholder="Full name or NGO" value={form.postedBy} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Contact number</label>
          <input name="contact" placeholder="+91 99999 99999" value={form.contact} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Your location / Address</label>
        <input name="address" placeholder="Where are you based?" value={form.address} onChange={handleChange} style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>Latitude</label>
          <input name="lat" placeholder="e.g. 17.385" value={form.lat} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Longitude</label>
          <input name="lng" placeholder="e.g. 78.486" value={form.lng} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <button type="button" onClick={() => {
        navigator.geolocation.getCurrentPosition(
          pos => setForm(f => ({ ...f, lat: pos.coords.latitude.toFixed(5), lng: pos.coords.longitude.toFixed(5) })),
          () => alert('Location access denied')
        )
      }} style={{ width: '100%', padding: '10px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, color: 'var(--green)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginBottom: 20, fontFamily: 'inherit' }}>
         Use My Current Location
      </button>

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Photo (optional)</label>
        <div style={{ border: '2px dashed rgba(16,185,129,0.15)', borderRadius: 10, padding: '20px', textAlign: 'center', position: 'relative', cursor: 'pointer' }}>
          <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }} />
          <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>📷</div>
          <div style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>{photo ? `✅ ${photo.name}` : 'Upload a photo of your resources'}</div>
        </div>
      </div>

      {success && <div style={{ background: 'var(--green-bg)', border: '1px solid var(--green-border)', color: 'var(--green)', padding: '12px 16px', borderRadius: 10, marginBottom: 16, textAlign: 'center', fontSize: '0.88rem' }}>✅ {success}</div>}

      <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '15px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'var(--green)', color: 'white', fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '1px', textTransform: 'uppercase', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Posting...' : 'Submit Offer →'}
      </button>
    </div>
  )
}

function PostForm() {
  const [formType, setFormType] = useState('need')

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: '0.75rem', letterSpacing: '3px', color: 'var(--blue2)', textTransform: 'uppercase', marginBottom: 8 }}>Aid Coordination</div>
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Post a Request</h2>
        <p style={{ color: 'var(--text3)', marginTop: 6, fontSize: '0.9rem' }}>Your post appears on the live map instantly and gets matched to nearby responders.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
        <button onClick={() => setFormType('need')} style={{
          padding: '16px', borderRadius: 12, cursor: 'pointer',
          fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px',
          background: formType === 'need' ? 'var(--blue)' : 'rgba(255,255,255,0.03)',
          color: formType === 'need' ? 'white' : 'var(--text3)',
          border: formType === 'need' ? '1px solid var(--blue)' : '1px solid var(--border)',
          boxShadow: formType === 'need' ? '0 4px 16px rgba(59,124,255,0.3)' : 'none'
        }}> I NEED HELP</button>
        <button onClick={() => setFormType('offer')} style={{
          padding: '16px', borderRadius: 12, cursor: 'pointer',
          fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px',
          background: formType === 'offer' ? 'var(--green)' : 'rgba(255,255,255,0.03)',
          color: formType === 'offer' ? 'white' : 'var(--text3)',
          border: formType === 'offer' ? '1px solid var(--green)' : '1px solid var(--border)',
          boxShadow: formType === 'offer' ? '0 4px 16px rgba(16,185,129,0.3)' : 'none'
        }}> I CAN HELP</button>
      </div>

      {formType === 'need' ? <NeedForm /> : <OfferForm />}
    </div>
  )
}

export default PostForm