import React from 'react';
import {BrowserRouter as Router, Route, Routes, Link, NavLink} from 'react-router-dom';
import Test from './Test/Test'; // Your Test component
import TrainDetails from './components/TrainDetails'; // Ensure this is a default import
import TrainSearch from './Test/TrainSearch';
import './Test/Test.css';
import './App.css'

const App = () => {
    return (
        <Router>
            <div className="app-shell">
                <div className="app-background" aria-hidden="true">
                    <svg className="bg-orbit bg-orbit-left" viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="railPulseLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4ed4f2"/>
                                <stop offset="100%" stopColor="#0f8db8"/>
                            </linearGradient>
                        </defs>
                        <circle cx="210" cy="210" r="170" fill="none" stroke="url(#railPulseLeft)" strokeWidth="2" opacity="0.25"/>
                        <circle cx="210" cy="210" r="125" fill="none" stroke="url(#railPulseLeft)" strokeWidth="3" opacity="0.2"/>
                        <path d="M70 250 C145 145, 270 145, 350 250" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="5" strokeLinecap="round"/>
                    </svg>
                    <svg className="bg-orbit bg-orbit-right" viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="railPulseRight" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f9bf59"/>
                                <stop offset="100%" stopColor="#f28749"/>
                            </linearGradient>
                        </defs>
                        <rect x="85" y="85" width="250" height="250" rx="70" fill="none" stroke="url(#railPulseRight)" strokeWidth="3" opacity="0.24"/>
                        <path d="M110 300 L310 120" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="8" strokeLinecap="round"/>
                        <circle cx="110" cy="300" r="13" fill="#ffffff" fillOpacity="0.42"/>
                        <circle cx="310" cy="120" r="13" fill="#ffffff" fillOpacity="0.42"/>
                    </svg>
                </div>

                <header className="topbar">
                    <Link to="/" className="brand">
                        <span className="brand-mark" aria-hidden="true">
                            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                <rect x="8" y="10" width="48" height="38" rx="12" fill="#0f8db8"/>
                                <rect x="15" y="18" width="34" height="11" rx="5" fill="#d6f5ff"/>
                                <circle cx="22" cy="46" r="5" fill="#f9bf59"/>
                                <circle cx="42" cy="46" r="5" fill="#f9bf59"/>
                                <path d="M6 56 H58" stroke="#183140" strokeWidth="4" strokeLinecap="round"/>
                            </svg>
                        </span>
                        <span className="brand-text">OnTrack</span>
                    </Link>

                    <nav className="topnav" aria-label="Main navigation">
                        <NavLink to="/" end className={({isActive}) => isActive ? 'topnav-link is-active' : 'topnav-link'}>
                            Rail Planner
                        </NavLink>
                        <NavLink to="/train-search" className={({isActive}) => isActive ? 'topnav-link is-active' : 'topnav-link'}>
                            Search Trains
                        </NavLink>
                    </nav>
                </header>

                <main className="app-content">
                    <Routes>
                        <Route path="/" element={<Test />}/>
                        <Route path="/train-details" element={<TrainDetails />}/>
                        <Route path='/train-search' element={<TrainSearch />}/>
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
