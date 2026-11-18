
import { useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import {
  Activity, AlertTriangle, GitBranch, History,
  LayoutDashboard, Menu, PlusCircle, Server, ShieldCheck
} from 'lucide-react';

import Dashboard from './pages/Dashboard.jsx';
import CreateTransaction from './pages/CreateTransaction.jsx';
import Processing from './pages/Processing.jsx';
import FsmView from './pages/FsmView.jsx';
import HistoryPage from './pages/History.jsx';
import Services from './pages/Services.jsx';
import Errors from './pages/Errors.jsx';

const NAV = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/create', 'New transaction', PlusCircle],
  ['/process', 'Processing', Activity],
  ['/fsm', 'State machine', GitBranch],
  ['/history', 'History', History],
  ['/services', 'Services', Server],
  ['/errors', 'Errors & rollbacks', AlertTriangle],
];

function Shell({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="shell">
      <aside className={`side ${open ? 'open' : ''}`}>
        <div className="brand">
          <ShieldCheck size={22} />
          <span>TxnVerify</span>
        </div>

        <nav>
          {NAV.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main">
        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Shell><Dashboard /></Shell>} />
      <Route path="/create" element={<Shell><CreateTransaction /></Shell>} />
      <Route path="/process" element={<Shell><Processing /></Shell>} />
      <Route path="/process/:id" element={<Shell><Processing /></Shell>} />
      <Route path="/fsm" element={<Shell><FsmView /></Shell>} />
      <Route path="/history" element={<Shell><HistoryPage /></Shell>} />
      <Route path="/services" element={<Shell><Services /></Shell>} />
      <Route path="/errors" element={<Shell><Errors /></Shell>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
