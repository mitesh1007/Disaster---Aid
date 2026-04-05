import { useState } from 'react'
import Home from './pages/Home'
import Map from './components/Map'
import Feed from './components/Feed'
import PostForm from './components/PostForm'
import AlertBanner from './components/AlertBanner'
import './App.css'

function App() {
  const [page, setPage] = useState('home')
  if (page === 'home') return <Home navigate={setPage} />

  return (
    <div className="app">
      <header className="header">
        <div className="logo" onClick={() => setPage('home')}>
          <div className="logo-mark">DA</div>
          <div>
            <div className="logo-name">DisasterAid</div>
            <div className="logo-tagline">Relief Network</div>
          </div>
        </div>
        <nav className="nav">
          <button className={page === 'map' ? 'active' : ''} onClick={() => setPage('map')}>Live Map</button>
          <button className={page === 'feed' ? 'active' : ''} onClick={() => setPage('feed')}>Feed</button>
          <button className={page === 'post' ? 'active' : ''} onClick={() => setPage('post')}>Post Aid</button>
        </nav>
        <div className="live-indicator">
          <span className="live-dot"></span>
          LIVE
        </div>
      </header>
      <AlertBanner />
      <main className="main">
        {page === 'map' && <Map />}
        {page === 'feed' && <Feed />}
        {page === 'post' && <PostForm />}
      </main>
    </div>
  )
}

export default App