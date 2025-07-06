import './Header.css';
import Logo from '../assets/Logoilike.svg';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <img src={Logo} alt="Logo" className="logo" />
        <span className="title">BHABIT</span>
      </div>
      <div className="subtitle">REAL-TIME CRYPTOCURRENCY MARKET DATA</div>
    </header>
  );
}