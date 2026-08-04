// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, Settings, Scissors, UserCheck, DollarSign, MessageSquare, Sparkles } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Musteriler from './pages/Musteriler';
import Randevular from './pages/Randevular';
import Hizmetler from './pages/Hizmetler';
import Personel from './pages/Personel';
import Finans from './pages/Finans';
import Pazarlama from './pages/Pazarlama';
import AiZeka from './pages/AiZeka';
import Ayarlar from './pages/Ayarlar';
import './index.css';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`nav-item ${isActive ? 'active' : ''}`}>
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

export default function App() {
  return (
    <Router>
      <div className="app-container">
        
        {/* NAVİGASYON MENÜSÜ */}
        <nav className="navbar">
          <NavItem to="/" icon={Home} label="Ana Sayfa" />
          <NavItem to="/randevular" icon={Calendar} label="Randevular" />
          <NavItem to="/hizmetler" icon={Scissors} label="Hizmetler" />
          <NavItem to="/finans" icon={DollarSign} label="Finans" />
          <NavItem to="/pazarlama" icon={MessageSquare} label="Pazarlama" />
          <NavItem to="/ai-zeka" icon={Sparkles} label="AI Zekâ" />
          <NavItem to="/personel" icon={UserCheck} label="Personel" />
          <NavItem to="/musteriler" icon={Users} label="Müşteriler" />
          <NavItem to="/ayarlar" icon={Settings} label="Ayarlar" />
        </nav>

        {/* EKRAN İÇERİĞİ */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/randevular" element={<Randevular />} />
            <Route path="/hizmetler" element={<Hizmetler />} />
            <Route path="/finans" element={<Finans />} />
            <Route path="/pazarlama" element={<Pazarlama />} />
            <Route path="/ai-zeka" element={<AiZeka />} />
            <Route path="/personel" element={<Personel />} />
            <Route path="/musteriler" element={<Musteriler />} />
            <Route path="/ayarlar" element={<Ayarlar />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}