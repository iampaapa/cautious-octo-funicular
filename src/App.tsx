import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import './App.css'

interface NavLinkProps {
  to: string
  className?: string // Optional because it might not always be provided
  children: React.ReactNode // ReactNode covers anything that can be rendered: numbers, strings, elements or an array
}

const NavLink: React.FC<NavLinkProps> = ({ to, className, children }) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link to={to} className={`${className} ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  )
}

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  return (
    <div className="App m-4">
      <div className={`drawer ${drawerOpen ? 'open' : 'closed'}`}>
        <button onClick={handleToggleDrawer} className="menu-button">
          &#9776;
        </button>
        <nav>
          <ul>
            <li>
              <NavLink to="/" className="nav-link">
                <i className="fas fa-question-circle"></i>
                <span>Take a Quiz</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/viewTranscripts" className="nav-link">
                <i className="fas fa-paste"></i>
                <span>View Transcripts</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/generateReport" className="nav-link">
                <i className="fas fa-chart-line"></i>
                <span>Generate Report</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/rewardsBadges" className="nav-link">
                <i className="fas fa-medal"></i>
                <span>Rewards & Badges</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className="nav-link">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/round" className="nav-link">
                <i className="fas fa-cog"></i>
                <span>Round-for-Test</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
