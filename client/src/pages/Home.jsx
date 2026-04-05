import { useEffect, useRef } from 'react'

const features = [
  { icon: '🗺️', title: 'Live Disaster Map', desc: 'Real-time geo-tagged needs and offers on an interactive map, color-coded by urgency.' },
  { icon: '⚡', title: 'Smart Geo-Matching', desc: 'Haversine algorithm instantly matches needs to the 3 closest available volunteers.' },
  { icon: '📡', title: 'Real-Time Sync', desc: 'Socket.io powered — new posts appear across all devices instantly, no refresh.' },
  { icon: '📸', title: 'Photo Verification', desc: 'Upload situation photos to verify ground reality and build trust with volunteers.' },
  { icon: '🔔', title: 'Emergency Alerts', desc: 'Broadcast critical alerts to all users in an affected region in seconds.' },
  { icon: '📊', title: 'Impact Dashboard', desc: 'Track needs resolved, volunteers deployed, and lives helped in real time.' },
]

const steps = [
  { n: '01', title: 'Post a Need', desc: 'Victim or NGO submits what is required — type, urgency level, location, and photo.' },
  { n: '02', title: 'Auto-Matched', desc: 'System finds the 3 closest volunteers with matching resources within 10km.' },
  { n: '03', title: 'Volunteer Acts', desc: 'Volunteer accepts, heads to location. Status updates live for all parties.' },
  { n: '04', title: 'Aid Delivered', desc: 'Need marked resolved. Impact logged. Community strengthened.' },
]

export default function Home({ navigate }) {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 48px', height: 64, borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'rgba(7,13,26,0.95)', backdropFilter: 'blur(20px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#3b7cff,#1d4ed8)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '0.78rem', color: 'white', boxShadow: '0 0 20px rgba(59,124,255,0.35)' }}>DA</div>
          <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1.05rem' }}>DisasterAid</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <a href="#features" style={{ color: 'var(--text3)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}>Features</a>
          <a href="#how" style={{ color: 'var(--text3)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}>How it works</a>
          <button onClick={() => navigate('map')} style={{ padding: '9px 22px', background: 'var(--blue)', border: 'none', borderRadius: 9, color: 'white', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(59,124,255,0.35)', fontFamily: 'inherit' }}>Open Platform →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 48px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--blue-bg)', border: '1px solid var(--blue-border)', borderRadius: 20, padding: '6px 14px', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, background: 'var(--green)', borderRadius: '50%', display: 'inline-block', animation: 'livepulse 1.8s infinite' }}></span>
            <span style={{ fontSize: '0.78rem', color: 'var(--blue2)', fontWeight: 600, letterSpacing: '0.5px' }}>Live Relief Coordination Platform</span>
          </div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '3.6rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 20 }}>
            When disaster strikes,<br />
            <span style={{ background: 'linear-gradient(135deg,#3b7cff,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>every second counts</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text2)', lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
            DisasterAid connects victims, volunteers, and NGOs in real time. Post a need, offer help, and coordinate relief — all on one intelligent platform.
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
            <button onClick={() => navigate('post')} style={{ padding: '13px 28px', background: 'var(--blue)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(59,124,255,0.4)', fontFamily: 'inherit' }}>Post a Need</button>
            <button onClick={() => navigate('map')} style={{ padding: '13px 28px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, color: 'var(--text)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' }}>View Live Map</button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['🍱 Food', '💧 Water', '🏠 Shelter', '🩺 Medical', '🚨 Rescue'].map(c => (
              <span key={c} style={{ padding: '5px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 20, fontSize: '0.82rem', color: 'var(--text2)' }}>{c}</span>
            ))}
          </div>
        </div>

        {/* Right side — stats card */}
        <div style={{ position: 'relative' }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--blue2)', marginBottom: 20 }}>Platform Stats</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {[
                { n: '2.4M+', l: 'Lives Helped', c: 'var(--blue)' },
                { n: '180K', l: 'Needs Resolved', c: 'var(--green)' },
                { n: '45K+', l: 'Volunteers', c: 'var(--orange)' },
                { n: '320+', l: 'NGO Partners', c: '#a78bfa' },
              ].map(s => (
                <div key={s.l} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 14px' }}>
                  <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.8rem', color: s.c, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 5, letterSpacing: '0.5px' }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--green-bg)', border: '1px solid var(--green-border)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, background: 'var(--green)', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }}></span>
              <span style={{ fontSize: '0.82rem', color: 'var(--green)', fontWeight: 600 }}>12 active operations right now</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 48px' }}>
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--blue2)', marginBottom: 12 }}>Capabilities</div>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.8px' }}>Built for the frontlines</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {features.map((f, i) => (
            <div key={f.title} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px 22px', transition: 'border-color 0.2s, transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-border)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 48px', borderTop: '1px solid var(--border)' }}>
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--blue2)', marginBottom: 12 }}>Process</div>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.8px' }}>How it works</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {steps.map(s => (
            <div key={s.n} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px 20px' }}>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '2rem', color: 'var(--bg3)', marginBottom: 14, WebkitTextStroke: '1px var(--border2)' }}>{s.n}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: '0.83rem', color: 'var(--text2)', lineHeight: 1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '80px 48px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(59,124,255,0.08),rgba(59,124,255,0.03))', border: '1px solid var(--blue-border)', borderRadius: 20, padding: '52px 40px' }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.8px', marginBottom: 14 }}>Ready to make a difference?</h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 32 }}>Join thousands of volunteers and NGOs coordinating real-world relief.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => navigate('post')} style={{ padding: '13px 28px', background: 'var(--blue)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(59,124,255,0.4)', fontFamily: 'inherit' }}>Post Aid Request</button>
            <button onClick={() => navigate('feed')} style={{ padding: '13px 28px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, color: 'var(--text)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' }}>Browse Feed</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#3b7cff,#1d4ed8)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '0.65rem', color: 'white' }}>DA</div>
          <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>DisasterAid — Community Relief Network</span>
        </div>
        <span style={{ color: 'var(--text3)', fontSize: '0.78rem' }}>Built for impact. Free forever.</span>
      </footer>
    </div>
  )
}