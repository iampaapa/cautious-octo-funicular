import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom'
import './App.css'

// Import or define your page components here
// import TakeQuiz from './TakeQuiz';
import ViewTranscripts from './ViewTranscripts'
import GenerateReport from './GenerateReport'
import RewardsBadges from './RewardsBadges'
import Settings from './Settings'
import QuizSettingPage from './QuizSettingPage'
import StandardNSMQ from './StandardNSMQ'
import CreateSetup from './CreateSetup'
import Round from './Round'

// Define props for NavLink component
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
    <Router>
      <div className="App">
        <div className={`drawer ${drawerOpen ? 'open' : 'closed'}`}>
          <button onClick={handleToggleDrawer} className="menu-button">
            &#9776;
          </button>
          <nav>
            <ul>
              <li>
                <NavLink to="/takeQuiz" className="nav-link">
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
          <Routes>
            <Route path="/takeQuiz" element={<QuizSettingPage />} />
            <Route path="/viewTranscripts" element={<ViewTranscripts />} />
            <Route path="/generateReport" element={<GenerateReport />} />
            <Route path="/rewardsBadges" element={<RewardsBadges />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/standard-nsmq" element={<StandardNSMQ />} />
            <Route path="/kwame-ai" element={<StandardNSMQ />} />
            <Route path="/create-setup" element={<CreateSetup />} />
            <Route path="/round" element={<Round />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
