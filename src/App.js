import React from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Test from './Test/Test'; // Your Test component
import TrainDetails from './components/TrainDetails'; // Ensure this is a default import
import TrainSearch from './Test/TrainSearch';
import './Test/Test.css';
import './App.css'

const App = () => {
    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand-lg bg-light">
                    <div className='container-fluid'>
                        <Link to="/" className="navbar-brand"><img src='/logo512.png' alt="logo" width="30"/></Link>
                    </div>
                    <button
                        className='navbar-toggler'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarSupportedContent'
                        aria-controls='navbarSupportedContent'
                        aria-expanded='false'
                        aria-label='Toggle navigation'>
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                        <ul className='navbar-nav'>
                            <li className='nav-item'>
                                <Link to="/" className="nav-link active" aria-current='page'>Rail Planner</Link>
                            </li>
                            <li className='nav-item'>
                                <Link to="/train-search" className="nav-link">Search Trains</Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<Test />}/>
                    <Route path="/train-details" element={<TrainDetails />}/>
                    <Route path='/train-search' element={<TrainSearch />}/>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
