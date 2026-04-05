import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:5000')

function AlertBanner() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    socket.on('newIncident', (incident) => {
      setAlerts(prev => [...prev, incident])
      setTimeout(() => setAlerts(prev => prev.slice(1)), 5000)
    })
    return () => socket.off('newIncident')
  }, [])

  if (alerts.length === 0) return null

  return (
    <div style={{ background: '#dc2626', padding: '12px 20px', textAlign: 'center', fontWeight: 'bold' }}>
      🚨 ALERT: {alerts[0].name} — {alerts[0].type.toUpperCase()} — Severity: {alerts[0].severity.toUpperCase()}
    </div>
  )
}

export default AlertBanner