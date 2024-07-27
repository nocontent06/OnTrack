// import React, { useState, useEffect } from 'react';
// import Autosuggest from 'react-autosuggest';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrain, faClock, faSubway, faArrowRight, faExchangeAlt, faSignOutAlt, faChevronDown, faChevronUp, faExclamationTriangle, faCog, faBars } from '@fortawesome/free-solid-svg-icons';
// import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
// import { 
//     fetchJourneys, 
//     calculateChangeTime, 
//     calculateTotalTravelTime, 
//     calculateChangeTimeInMinutes, 
//     countIssues, 
//     formatTime, 
//     fetchSuggestions, 
//     getSuggestionValue, 
//     renderSuggestion,
//     getClassForTrain,
//     formatChangeDuration,
//     formatChangeInfo,
// } from '../components/GetTrainData';
// import './Test.css';
// import TrainSearch from './TrainSearch'; // New component for train search
// import 'bootstrap/dist/css/bootstrap.min.css';


// const Test = () => {
//     const [fromQuery, setFromQuery] = useState('');
//     const [toQuery, setToQuery] = useState('');
//     const [fromSuggestions, setFromSuggestions] = useState([]);
//     const [toSuggestions, setToSuggestions] = useState([]);
//     const [fromId, setFromId] = useState(null);
//     const [toId, setToId] = useState(null);
//     const [journeys, setJourneys] = useState([]);
//     const [expandedTrain, setExpandedTrain] = useState(null);
//     const [travelTime, setTravelTime] = useState('');
//     const [optionsExpanded, setOptionsExpanded] = useState(false);
//     const [changeTime, setChangeTime] = useState(0);
//     const [maxChanges, setMaxChanges] = useState(0);
//     const [excludedTrains, setExcludedTrains] = useState([]);

//     useEffect(() => {
//         if (fromId && toId) {
//             fetchJourneys(fromId, toId, travelTime, setJourneys, changeTime, maxChanges, excludedTrains);
//         }
//     }, [fromId, toId, travelTime, changeTime, maxChanges, excludedTrains]);

//     const handleSuggestionsFetchRequested = ({ value }, setSuggestions) => {
//         fetchSuggestions(value, setSuggestions);
//     };
    
//     const handleSuggestionsClearRequested = (setSuggestions) => {
//         setSuggestions([]);
//     };
    
//     const handleInputChange = (setter) => (event, { newValue }) => {
//         setter(newValue);
//     };
    
//     const handleSuggestionSelected = (setter) => (event, { suggestion }) => {
//         setter(suggestion.id);
//     };
    
//     const handleSearch = () => {
//         if (fromId && toId) {
//             fetchJourneys(fromId, toId, travelTime, setJourneys, changeTime, maxChanges, excludedTrains);
//         }
//     };
    
//     const toggleDetails = (index) => {
//         setExpandedTrain(expandedTrain === index ? null : index);
//     };
    
//     const handleTravelTimeChange = (event) => {
//         setTravelTime(event.target.value);
//     };
    
//     const handleOptionChange = (setter) => (event) => {
//         setter(event.target.value);
//     };
    
//     const handleCheckboxChange = (train) => {
//         setExcludedTrains((prevExcludedTrains) =>
//             prevExcludedTrains.includes(train)
//                 ? prevExcludedTrains.filter((item) => item !== train)
//                 : [...prevExcludedTrains, train]
//         );
//     };

//     console.log("FromId: ", fromId, "ToId: ", toId, "Travel Time: ", travelTime, "Change Time: ", changeTime, "Max Changes: ", maxChanges, "Excluded Trains: ", excludedTrains);

//     return (
//         <Router>
//             <div className="app">
//                 <nav className="navbar navbar-expand-lg bg-light">
//                     <div className='container-fluid'>
//                         <Link to="/" className="navbar-brand">OnTrack</Link>
//                     </div>
//                     <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
//                         <span className='navbar-toggler-icon'></span>
//                     </button>
//                     <div className='collapse navbar-collapse' id='navbarSupportedContent'>
//                         <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
//                             <li className='nav-item'>
//                                 <Link to="/" className="nav-link active">Rail Planner</Link>
//                             </li>
//                             <li className='nav-item'>
//                                 <Link to="/train-search" className="nav-link">Search Trains</Link>
//                             </li>
//                         </ul>
//                     </div>
//                 </nav>
//                 <Routes>
//                     <Route path="/" element={
//                         <div className="test">
//                             <h1 className='title'>OnTrack - Rail Planner</h1>
//                             <div className="input-group">
//                                 <Autosuggest
//                                     suggestions={fromSuggestions}
//                                     onSuggestionsFetchRequested={({ value }) => handleSuggestionsFetchRequested({ value }, setFromSuggestions)}
//                                     onSuggestionsClearRequested={() => handleSuggestionsClearRequested(setFromSuggestions)}
//                                     getSuggestionValue={getSuggestionValue}
//                                     renderSuggestion={renderSuggestion}
//                                     onSuggestionSelected={(event, { suggestion }) => handleSuggestionSelected(setFromId)(event, { suggestion })}
//                                     inputProps={{
//                                         placeholder: 'From...',
//                                         value: fromQuery,
//                                         onChange: handleInputChange(setFromQuery),
//                                     }}
//                                     className="search-input"
//                                 />
//                                 <Autosuggest
//                                     suggestions={toSuggestions}
//                                     onSuggestionsFetchRequested={({ value }) => handleSuggestionsFetchRequested({ value }, setToSuggestions)}
//                                     onSuggestionsClearRequested={() => handleSuggestionsClearRequested(setToSuggestions)}
//                                     getSuggestionValue={getSuggestionValue}
//                                     renderSuggestion={renderSuggestion}
//                                     onSuggestionSelected={(event, { suggestion }) => handleSuggestionSelected(setToId)(event, { suggestion })}
//                                     inputProps={{
//                                         placeholder: 'To...',
//                                         value: toQuery,
//                                         onChange: handleInputChange(setToQuery),
//                                     }}
//                                     className="search-input"
//                                 />
//                                 <select value={travelTime} onChange={handleTravelTimeChange} className="travel-time-dropdown">
//                                     <option value="">now</option>
//                                     <option value="00:00">00:00</option>
//                                 </select>
//                                 <button onClick={handleSearch} className="search-button">Search</button>
//                                 <button onClick={() => setOptionsExpanded(!optionsExpanded)} className="options-button">
//                                     <FontAwesomeIcon icon={faCog} /> Options
//                                 </button>
//                             </div>
//                             {optionsExpanded && (
//                                 <div className="options">
//                                     <div className="option-item">
//                                         <label>Minimum Change Time (minutes):</label>
//                                         <input type="number" value={changeTime} onChange={handleOptionChange(setChangeTime)} />
//                                     </div>
//                                     <div className="option-item">
//                                         <label>Maximum Changes:</label>
//                                         <input type="number" value={maxChanges} onChange={handleOptionChange(setMaxChanges)} />
//                                     </div>
//                                     <div className="option-item">
//                                         <label>Exclude Trains:</label>
//                                         <div className="checkbox-group">
//                                             {['ICE', 'IC', 'RE', 'RB', 'S-Bahn'].map((train) => (
//                                                 <div key={train} className="checkbox-item">
//                                                     <input
//                                                         type="checkbox"
//                                                         checked={excludedTrains.includes(train)}
//                                                         onChange={() => handleCheckboxChange(train)}
//                                                     />
//                                                     <label>{train}</label>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                             <ul className="train-list">
//                                 {journeys.map((journey, index) => {
//                                     const trainLegs = journey.legs.filter(leg => !leg.walking);

//                                     return (
//                                         <li key={index} className="train-item">
//                                             <div className="train-summary">
//                                                 <div className="train-line-container">
//                                                     {trainLegs.map((leg, legIndex) => (
//                                                         <div key={legIndex} className={`train-line ${getClassForTrain(leg.line)}`}>
//                                                             <FontAwesomeIcon icon={faTrain} /> {leg.line ? leg.line.name : 'Unknown Train'}
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                                 <div className="train-times">
//                                                     <div><FontAwesomeIcon icon={faClock} /> Departure: {formatTime(journey.legs[0].departure)}</div>
//                                                     <div><FontAwesomeIcon icon={faClock} /> Arrival: {formatTime(journey.legs[journey.legs.length - 1].arrival)}</div>
//                                                     <div className="issue-count">
//                                                         Issues: {countIssues(journey.legs)}
//                                                     </div>
//                                                 </div>
//                                                 <div className="toggle-details" onClick={() => toggleDetails(index)}>
//                                                     <span>Details</span>
//                                                     <FontAwesomeIcon icon={expandedTrain === index ? faChevronUp : faChevronDown} className="toggle-icon" />
//                                                 </div>
//                                                 {expandedTrain === index && (
//                                                     <div className="train-details">
//                                                         <div className="train-details-header">
//                                                             <FontAwesomeIcon icon={faTrain} /> {trainLegs.length > 0 ? trainLegs[0].line.name : 'Unknown Train'} Details
//                                                         </div>
//                                                         <ul>
//                                                             {trainLegs.map((leg, legIndex) => (
//                                                                 <React.Fragment key={legIndex}>
//                                                                     <li className={`detailed-item ${getClassForTrain(leg.line)}`}>
//                                                                         <div>
//                                                                             <FontAwesomeIcon icon={faTrain} /> {leg.line ? leg.line.name : 'Unknown Train'}
//                                                                         </div>
//                                                                         <div>
//                                                                             <FontAwesomeIcon icon={faClock} /> {formatTime(leg.departure)} - {formatTime(leg.arrival)}
//                                                                         </div>
//                                                                         <div>
//                                                                             <FontAwesomeIcon icon={faSubway} /> Platform {leg.departurePlatform || '--'}
//                                                                         </div>
//                                                                         <div>
//                                                                             <FontAwesomeIcon icon={faArrowRight} /> Dir.: {leg.direction}
//                                                                         </div>
//                                                                         <div>
//                                                                             <FontAwesomeIcon icon={faSignOutAlt} /> Exit: {leg.destination ? leg.destination.name : '--'}
//                                                                         </div>
//                                                                     </li>
//                                                                     {legIndex < trainLegs.length - 1 && (
//                                                                         <li className="detailed-item change-info">
//                                                                             <FontAwesomeIcon icon={faExchangeAlt} /> {formatChangeInfo(leg, trainLegs[legIndex + 1])}
//                                                                         </li>
//                                                                     )}
//                                                                 </React.Fragment>
//                                                             ))}
//                                                         </ul>
//                                                         <div className="total-travel-time">
//                                                             Total Travel Time: {calculateTotalTravelTime(journey.legs)}
//                                                         </div>
//                                                         <div className="issue-count">
//                                                             Issues: {countIssues(journey.legs)}
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </li>
//                                     );
//                                 })}
//                             </ul>
//                         </div>
//                     } />
//                     <Route path="/train-search" element={<TrainSearch />} />
//                 </Routes>
//             </div>
//         </Router>
//     );
// };

// export default Test;


import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrain, faClock, faSubway, faArrowRight, faExchangeAlt, faSignOutAlt, faChevronDown, faChevronUp, faExclamationTriangle, faCog, faBars } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { 
    fetchJourneys, 
    calculateChangeTime, 
    calculateTotalTravelTime, 
    calculateChangeTimeInMinutes, 
    countIssues, 
    formatTime, 
    fetchSuggestions, 
    getSuggestionValue, 
    renderSuggestion,
    getClassForTrain,
    formatChangeDuration,
    formatChangeInfo,
} from '../components/GetTrainData';
import './Test.css';
import TrainSearch from './TrainSearch'; // New component for train search
import 'bootstrap/dist/css/bootstrap.min.css';

const Test = () => {
    const [fromQuery, setFromQuery] = useState('');
    const [toQuery, setToQuery] = useState('');
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [fromId, setFromId] = useState(null);
    const [toId, setToId] = useState(null);
    const [journeys, setJourneys] = useState([]);
    const [expandedTrain, setExpandedTrain] = useState(null);
    const [travelTime, setTravelTime] = useState('');
    const [optionsExpanded, setOptionsExpanded] = useState(false);
    const [changeTime, setChangeTime] = useState(0);
    const [maxChanges, setMaxChanges] = useState(0);
    const [excludedTrains, setExcludedTrains] = useState([]);

    useEffect(() => {
        if (fromId && toId) {
            fetchJourneys(fromId, toId, travelTime, setJourneys, changeTime, maxChanges, excludedTrains);
        }
    }, [fromId, toId, travelTime, changeTime, maxChanges, excludedTrains]);

    const handleSuggestionsFetchRequested = ({ value }, setSuggestions) => {
        fetchSuggestions(value, setSuggestions);
    };
    
    const handleSuggestionsClearRequested = (setSuggestions) => {
        setSuggestions([]);
    };
    
    const handleInputChange = (setter) => (event, { newValue }) => {
        setter(newValue);
    };
    
    const handleSuggestionSelected = (setter) => (event, { suggestion }) => {
        setter(suggestion.id);
    };
    
    const handleSearch = () => {
        if (fromId && toId) {
            fetchJourneys(fromId, toId, travelTime, setJourneys, changeTime, maxChanges, excludedTrains);
        }
    };
    
    const toggleDetails = (index) => {
        setExpandedTrain(expandedTrain === index ? null : index);
    };
    
    const handleTravelTimeChange = (event) => {
        setTravelTime(event.target.value);
    };
    
    const handleOptionChange = (setter) => (event) => {
        setter(event.target.value);
    };
    
    const handleCheckboxChange = (train) => {
        setExcludedTrains((prevExcludedTrains) =>
            prevExcludedTrains.includes(train)
                ? prevExcludedTrains.filter((item) => item !== train)
                : [...prevExcludedTrains, train]
        );
    };

    console.log("FromId: ", fromId, "ToId: ", toId, "Travel Time: ", travelTime, "Change Time: ", changeTime, "Max Changes: ", maxChanges, "Excluded Trains: ", excludedTrains);

    return (
        <Router>
            <div className="app">
                <nav className="navbar navbar-expand-lg bg-light">
                    <div className='container-fluid'>
                        <Link to="/" className="navbar-brand">OnTrack</Link>
                    </div>
                    <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                        <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                            <li className='nav-item'>
                                <Link to="/" className="nav-link active">Rail Planner</Link>
                            </li>
                            <li className='nav-item'>
                                <Link to="/train-search" className="nav-link">Search Trains</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={
                        <div className="test">
                            <h1 className='title'>OnTrack - Rail Planner</h1>
                            <div className="input-group">
                                <Autosuggest
                                    suggestions={fromSuggestions}
                                    onSuggestionsFetchRequested={({ value }) => handleSuggestionsFetchRequested({ value }, setFromSuggestions)}
                                    onSuggestionsClearRequested={() => handleSuggestionsClearRequested(setFromSuggestions)}
                                    getSuggestionValue={getSuggestionValue}
                                    renderSuggestion={renderSuggestion}
                                    onSuggestionSelected={(event, { suggestion }) => handleSuggestionSelected(setFromId)(event, { suggestion })}
                                    inputProps={{
                                        placeholder: 'From...',
                                        value: fromQuery,
                                        onChange: handleInputChange(setFromQuery),
                                    }}
                                    className="search-input"
                                />
                                <Autosuggest
                                    suggestions={toSuggestions}
                                    onSuggestionsFetchRequested={({ value }) => handleSuggestionsFetchRequested({ value }, setToSuggestions)}
                                    onSuggestionsClearRequested={() => handleSuggestionsClearRequested(setToSuggestions)}
                                    getSuggestionValue={getSuggestionValue}
                                    renderSuggestion={renderSuggestion}
                                    onSuggestionSelected={(event, { suggestion }) => handleSuggestionSelected(setToId)(event, { suggestion })}
                                    inputProps={{
                                        placeholder: 'To...',
                                        value: toQuery,
                                        onChange: handleInputChange(setToQuery),
                                    }}
                                    className="search-input"
                                />
                                <select value={travelTime} onChange={handleTravelTimeChange} className="travel-time-dropdown">
                                    <option value="">now</option>
                                    <option value="00:00">00:00</option>
                                    {/* Add other time options as needed */}
                                </select>
                                <button onClick={handleSearch} className="search-button">Search</button>
                                <button onClick={() => setOptionsExpanded(!optionsExpanded)} className="options-button">
                                    <FontAwesomeIcon icon={faCog} /> Options
                                </button>
                            </div>
                            {optionsExpanded && (
                                <div className="options">
                                    <div className="option-item">
                                        <label>Minimum Change Time (minutes):</label>
                                        <input type="number" value={changeTime} onChange={handleOptionChange(setChangeTime)} />
                                    </div>
                                    <div className="option-item">
                                        <label>Maximum Changes:</label>
                                        <input type="number" value={maxChanges} onChange={handleOptionChange(setMaxChanges)} />
                                    </div>
                                    <div className="option-item">
                                        <label>Exclude Trains:</label>
                                        <div className="checkbox-group">
                                            {['ICE', 'IC', 'RE', 'RB', 'S-Bahn'].map((train) => (
                                                <div key={train} className="checkbox-item">
                                                    <input
                                                        type="checkbox"
                                                        checked={excludedTrains.includes(train)}
                                                        onChange={() => handleCheckboxChange(train)}
                                                    />
                                                    <label>{train}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {journeys.length === 0 || journeys === null || journeys === undefined ? (
                                <h1>No journeys were found</h1>
                            ) : (
                                <ul className="train-list">
                                    {journeys.map((journey, index) => {
                                        const trainLegs = journey.legs.filter(leg => !leg.walking);

                                        return (
                                            <li key={index} className="train-item">
                                                <div className="train-summary">
                                                    <div className="train-line-container">
                                                        {trainLegs.map((leg, legIndex) => (
                                                            <div key={legIndex} className={`train-line ${getClassForTrain(leg.line)}`}>
                                                                <FontAwesomeIcon icon={faTrain} /> {leg.line ? leg.line.name : 'Unknown Train'}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="train-times">
                                                        <div><FontAwesomeIcon icon={faClock} /> Departure: {formatTime(journey.legs[0].departure)}</div>
                                                        <div><FontAwesomeIcon icon={faClock} /> Arrival: {formatTime(journey.legs[journey.legs.length - 1].arrival)}</div>
                                                        <div className="issue-count">
                                                            Issues: {countIssues(journey.legs)}
                                                        </div>
                                                    </div>
                                                    <div className="toggle-details" onClick={() => toggleDetails(index)}>
                                                        <span>Details</span>
                                                        <FontAwesomeIcon icon={expandedTrain === index ? faChevronUp : faChevronDown} className="toggle-icon" />
                                                    </div>
                                                    {expandedTrain === index && (
                                                        <div className="train-details">
                                                            <div className="train-details-header">
                                                                <FontAwesomeIcon icon={faTrain} /> {trainLegs.length > 0 ? trainLegs[0].line.name : 'Unknown Train'} Details
                                                            </div>
                                                            <ul>
                                                                {trainLegs.map((leg, legIndex) => (
                                                                    <React.Fragment key={legIndex}>
                                                                        <li className={`detailed-item ${getClassForTrain(leg.line)}`}>
                                                                            <div>
                                                                                <FontAwesomeIcon icon={faTrain} /> {leg.line ? leg.line.name : 'Unknown Train'}
                                                                            </div>
                                                                            <div>
                                                                                <FontAwesomeIcon icon={faClock} /> {formatTime(leg.departure)} - {formatTime(leg.arrival)}
                                                                            </div>
                                                                            <div>
                                                                                <FontAwesomeIcon icon={faSubway} /> Platform {leg.departurePlatform || '--'}
                                                                            </div>
                                                                            <div>
                                                                                <FontAwesomeIcon icon={faArrowRight} /> Dir.: {leg.direction}
                                                                            </div>
                                                                            <div>
                                                                                <FontAwesomeIcon icon={faSignOutAlt} /> Exit: {leg.destination ? leg.destination.name : '--'}
                                                                            </div>
                                                                        </li>
                                                                        {legIndex < trainLegs.length - 1 && (
                                                                            <li className="detailed-item change-info">
                                                                                <FontAwesomeIcon icon={faExchangeAlt} /> {formatChangeInfo(leg, trainLegs[legIndex + 1])}
                                                                            </li>
                                                                        )}
                                                                    </React.Fragment>
                                                                ))}
                                                            </ul>
                                                            <div className="total-travel-time">
                                                                Total Travel Time: {calculateTotalTravelTime(journey.legs)}
                                                            </div>
                                                            <div className="issue-count">
                                                                Issues: {countIssues(journey.legs)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    } />
                    <Route path="/train-search" element={<TrainSearch />} />
                </Routes>
            </div>
        </Router>
    );
};

export default Test;










// <option value="now">Select Travel Time</option>
{/* <option value="00:00">00:00</option>
<option value="01:00">01:00</option>
<option value="02:00">02:00</option>
<option value="03:00">03:00</option>
<option value="04:00">04:00</option>
<option value="05:00">05:00</option>
<option value="06:00">06:00</option>
<option value="07:00">07:00</option>
<option value="08:00">08:00</option>
<option value="09:00">09:00</option>
<option value="10:00">10:00</option>
<option value="11:00">11:00</option>
<option value="12:00">12:00</option>
<option value="13:00">13:00</option>
<option value="14:00">14:00</option>
<option value="15:00">15:00</option>
<option value="16:00">16:00</option>
<option value="17:00">17:00</option>
<option value="18:00">18:00</option>
<option value="19:00">19:00</option>
<option value="20:00">20:00</option>
<option value="21:00">21:00</option>
<option value="22:00">22:00</option>
<option value="23:00">23:00</option> */}

// const walkingLegs = journey.legs.filter(leg => leg.walking); // underneath "const trainLegs = journey.legs.filter(leg => !leg.walking);"


// {journeys.length === 0 ? (
   // <h1>No journeys were found</h1>
// ) : (
   // <ul className="train-list">}