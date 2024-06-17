import React, { JSX, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaste, faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import { faChartLine, faCog, faMedal } from '@fortawesome/free-solid-svg-icons'

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

export default function App(): JSX.Element {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleToggleDrawer = (): void => {
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
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>Take a Quiz</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/viewTranscripts" className="nav-link">
                <FontAwesomeIcon icon={faPaste} />
                <span>View Transcripts</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/generateReport" className="nav-link">
                <FontAwesomeIcon icon={faChartLine} />
                <span>Generate Report</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/rewardsBadges" className="nav-link">
                <FontAwesomeIcon icon={faMedal} />
                <span>Rewards & Badges</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className="nav-link">
                <FontAwesomeIcon icon={faCog} />
                <span>Settings</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/round" className="nav-link">
                <FontAwesomeIcon icon={faCog} />
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
