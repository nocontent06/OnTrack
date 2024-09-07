import React, {useState, useEffect} from 'react';
import Autosuggest from 'react-autosuggest';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faTrain,
    faClock,
    faSubway,
    faArrowRight,
    faExchangeAlt,
    faSignOutAlt,
    faChevronDown,
    faChevronUp,
    faExclamationTriangle,
    faCog,
    faBars,
    faLocationDot,
    faBus
} from '@fortawesome/free-solid-svg-icons';
import {BrowserRouter as Router, Route, Link, Routes, useNavigate} from 'react-router-dom';
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
    TravelTimeDropdown,
    isDifferentArrival,
    isDifferentDeparture,
    hasDelays,
    getTripDetails
} from '../components/GetTrainData';
import {TrainDetails} from '../components/TrainDetails';
import './Test.css';
import TrainSearch from './TrainSearch'; // New component for train search
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const version = '0.2.1 (2024-09-07)';

const Test = () => {

    const navigate = useNavigate();

    const redirectToTripDetails = (leg) => {
        console.log("Button clicked...")
        const tripId = getTripDetails(leg);
        if (tripId !== '--') {
            const encodedTripId = tripId.replace(/#/g, '%23');
            console.log("Encoded trip ID 2:", encodedTripId);
            navigate(`/train-details/?tripId=${encodedTripId}`);
        }
    };

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
    const [maxResults, setMaxResults] = useState(0);
    const [excludedTrains, setExcludedTrains] = useState([]);

    useEffect(() => {
        if (fromId && toId) {
            fetchJourneys(
                fromId,
                toId,
                travelTime,
                setJourneys,
                changeTime,
                maxChanges,
                maxResults,
                excludedTrains
            );
        }
    }, [
        fromId,
        toId,
        travelTime,
        changeTime,
        maxChanges,
        excludedTrains
    ]);

    const handleSuggestionsFetchRequested = ({
        value
    }, setSuggestions) => {
        fetchSuggestions(value, setSuggestions);
    };

    const handleSuggestionsClearRequested = (setSuggestions) => {
        setSuggestions([]);
    };

    const handleInputChange = (setter) => (event, {newValue}) => {
        setter(newValue);
    };

    const handleSuggestionSelected = (setter) => (event, {suggestion}) => {
        setter(suggestion.id);
    };

    const handleSearch = () => {
        if (fromId && toId) {
            fetchJourneys(
                fromId,
                toId,
                travelTime,
                setJourneys,
                changeTime,
                maxChanges,
                excludedTrains,
            );
        }
    };

    const toggleDetails = (index) => {
        setExpandedTrain(
            expandedTrain === index
                ? null
                : index
        );
    };

    const handleTravelTimeChange = (event) => {
        setTravelTime(event.target.value);
    };

    const handleOptionChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const handleCheckboxChange = (trainGroup) => {
        const newExcludedTrains = [...excludedTrains];

        // Check if any train type in the group is already excluded
        const isExcluded = trainGroup.some(train => excludedTrains.includes(train));

        if (isExcluded) {
            // Remove all train types in the group from excludedTrains
            trainGroup.forEach(train => {
                const index = newExcludedTrains.indexOf(train);
                if (index > -1) {
                    newExcludedTrains.splice(index, 1);
                }
            });
        } else {
            // Add all train types in the group to excludedTrains
            newExcludedTrains.push(...trainGroup);
        }

        setExcludedTrains(newExcludedTrains);
    };

    const trainGroups = [
        {
            types: [
                "ICE", "ECE", "RJ", "RJX"
            ],
            icon: faTrain,
            color: "red"
        }, {
            types: [
                "IC", "EC"
            ],
            icon: faTrain,
            color: "red"
        }, {
            types: [
                "D", "RE", "IR", "RB"
            ],
            icon: faSubway,
            color: "blue"
        }, {
            types: [
                "BRB", "RS", "R"
            ],
            icon: faSubway,
            color: "blue"
        }, {
            types: ["S-Bahn"],
            icon: faSubway,
            color: "blue"
        }, {
            types: ["Bus"],
            icon: faBus,
            color: "gray"
        }
    ];

    console.log(
        "FromId: ",
        fromId,
        "ToId: ",
        toId,
        "Travel Time : ",
        travelTime,
        " Change Time : ",
        changeTime,
        " Max Changes : ",
        maxChanges,
        " Excluded Trains : ",
        excludedTrains
    );

    return (
        <div className="app">
            <nav className="navbar navbar-expand-lg bg-light">
                <div className='container-fluid'>
                    <Link to="/" className="navbar-brand">OnTrack</Link>
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
                <Route
                    path="/"
                    element={<div className = "test" > <h1 className='title'>OnTrack - Rail Planner</h1>
                        <div className="input-group">
                            <Autosuggest
                                suggestions={fromSuggestions}
                                onSuggestionsFetchRequested={({value}) => handleSuggestionsFetchRequested({
                                    value
                                }, setFromSuggestions)}
                                onSuggestionsClearRequested={() => handleSuggestionsClearRequested(setFromSuggestions)}
                                getSuggestionValue={getSuggestionValue}
                                renderSuggestion={renderSuggestion}
                                onSuggestionSelected={(event, {suggestion}) => handleSuggestionSelected(setFromId)(
                                    event,
                                    {suggestion}
                                )}
                                inputProps={{
                                    placeholder: 'From...',
                                    value: fromQuery,
                                    onChange: handleInputChange(setFromQuery)
                                }}
                                className="search-input"/>
                            <Autosuggest
                                suggestions={toSuggestions}
                                onSuggestionsFetchRequested={({value}) => handleSuggestionsFetchRequested({
                                    value
                                }, setToSuggestions)}
                                onSuggestionsClearRequested={() => handleSuggestionsClearRequested(setToSuggestions)}
                                getSuggestionValue={getSuggestionValue}
                                renderSuggestion={renderSuggestion}
                                onSuggestionSelected={(event, {suggestion}) => handleSuggestionSelected(setToId)(event, {suggestion})}
                                inputProps={{
                                    placeholder: 'To...',
                                    value: toQuery,
                                    onChange: handleInputChange(setToQuery)
                                }}
                                className="search-input"/>
                            <div>
                                <TravelTimeDropdown
                                    travelTime={travelTime}
                                    className="travel-time-dropdown"
                                    handleTravelTimeChange={handleTravelTimeChange}/>
                            </div>
                            <button onClick={handleSearch} className="search-button">Search</button>
                            <button
                                onClick={() => setOptionsExpanded(!optionsExpanded)}
                                className="options-button">
                                <FontAwesomeIcon icon={faCog}/>
                                Options
                            </button>
                        </div>
                        {
                        optionsExpanded && (
                            <div className="options">
                                <div className="option-item">
                                    <label>Minimum Change Time (minutes):</label>
                                    <input
                                        type="number"
                                        value={changeTime}
                                        onChange={handleOptionChange(setChangeTime)}/>
                                </div>
                                <div className="option-item">
                                    <label>Maximum Changes:</label>
                                    <input
                                        type="number"
                                        value={maxChanges}
                                        onChange={handleOptionChange(setMaxChanges)}/>
                                </div>
                                <div className='option-item'>
                                    <label>Results:
                                    </label>
                                    <input
                                        type="number"
                                        value={maxResults}
                                        onChange={handleOptionChange(setMaxResults)}/>
                                </div>
                                <div className="option-item">
                                    <label>Exclude Trains:</label>
                                    <div
                                        className="checkbox-group"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: '20px'
                                        }}>
                                        {
                                            trainGroups.map(({types, icon, color}) => {
                                                const typesArray = types;
                                                const isSelected = types.some(train => excludedTrains.includes(train));
                                                return (
                                                    <div
                                                        key={types.join('-')}
                                                        className="checkbox-item"
                                                        style={{
                                                            textAlign: 'center',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => handleCheckboxChange(types)}>
                                                        <div
                                                            style={{
                                                                backgroundColor: isSelected
                                                                    ? color
                                                                    : 'transparent',
                                                                color: isSelected
                                                                    ? 'black'
                                                                    : color,
                                                                borderRadius: '50%',
                                                                padding: '10px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: '50px',
                                                                height: '50px',
                                                                margin: '0 auto'
                                                            }}>
                                                            <FontAwesomeIcon icon={icon}/>
                                                        </div>
                                                        <div
                                                            style={{
                                                                marginTop: '5px',
                                                                color: isSelected
                                                                    ? color
                                                                    : 'black'
                                                            }}>
                                                             {types.length > 1 ? types.join(' / ') : types[0]}
                                                            </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>

                            </div>
                        )
                    } {
                        journeys.length === 0 || journeys === null || journeys === undefined
                            ? (<h1>No journeys were found</h1>)
                            : (
                                <ul className="train-list">
                                    {
                                        journeys.map((journey, index) => {
                                            const trainLegs = journey
                                                .legs
                                                .filter(leg => !leg.walking);

                                            return (
                                                <li key={index} className="train-item">
                                                    <div className="train-summary">
                                                        <div className="train-line-container">
                                                            {
                                                                trainLegs.map((leg, legIndex) => (
                                                                    <div key={legIndex} className={`train-line ${getClassForTrain(leg.line)}`}>
                                                                        <FontAwesomeIcon icon={faTrain}/> {
                                                                            leg.line
                                                                                ? leg.line.name
                                                                                : 'Unknown Train'
                                                                        }
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="train-times">
                                                        <div><FontAwesomeIcon icon={faClock}/>&nbsp; Departure: {
                                                                isDifferentDeparture(journey.legs[0])
                                                                    ? (
                                                                        <div>
                                                                            <div
                                                                                style={{
                                                                                    textDecoration: 'line-through'
                                                                                }}>
                                                                                {formatTime(journey.legs[0].plannedDeparture)}
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    color: 'red'
                                                                                }}>
                                                                                {formatTime(journey.legs[0].departure)}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                    : (
                                                                        <div
                                                                            style={{
                                                                                color: 'green'
                                                                            }}>{formatTime(journey.legs[0].departure)}</div>
                                                                    )
                                                            }
                                                        </div>
                                                        <div><FontAwesomeIcon icon={faClock}/>&nbsp; Arrival: {
                                                                isDifferentArrival(journey.legs[journey.legs.length - 1])
                                                                    ? (
                                                                        <div>
                                                                            <div
                                                                                style={{
                                                                                    textDecoration: 'line-through'
                                                                                }}>
                                                                                {formatTime(journey.legs[journey.legs.length - 1].plannedArrival)}
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    color: 'red'
                                                                                }}>
                                                                                {formatTime(journey.legs[journey.legs.length - 1].arrival)}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                    : (
                                                                        <div
                                                                            style={{
                                                                                color: 'green'
                                                                            }}>{formatTime(journey.legs[journey.legs.length - 1].arrival)}</div>
                                                                    )
                                                            }
                                                            <div className="issue-count">
                                                                Issues: {countIssues(journey.legs)}
                                                            </div>
                                                            <div className="train-delay-notification">
                                                                {/* {hasDelays && (
                                                                        <div className="warning">
                                                                            <FontAwesomeIcon icon={faExclamationTriangle} /> Some Trains are delayed
                                                                        </div>
                                                                    )} */
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="toggle-details" onClick={() => toggleDetails(index)}>
                                                            <span>Details</span>
                                                            <FontAwesomeIcon
                                                                icon={expandedTrain === index
                                                                    ? faChevronUp
                                                                    : faChevronDown}
                                                                className="toggle-icon"/>
                                                        </div>
                                                        {
                                                            expandedTrain === index && (
                                                                <div className="train-details">
                                                                    <div className="train-details-header">
                                                                        <FontAwesomeIcon icon={faLocationDot}/>&nbsp; {/* From and to */}
                                                                        {
                                                                            journey
                                                                                .legs[0]
                                                                                .origin
                                                                                .name
                                                                        }
                                                                        &nbsp; - {
                                                                            journey
                                                                                .legs[journey.legs.length - 1]
                                                                                .destination
                                                                                .name
                                                                        }

                                                                    </div>
                                                                    <ul>
                                                                        {
                                                                            trainLegs.map((leg, legIndex) => (
                                                                                <React.Fragment key={legIndex}>
                                                                                    <li
                                                                                        className={`detailed-item cursor-pointer ${getClassForTrain(leg.line)}`}
                                                                                        onClick={() => redirectToTripDetails(leg)}>
                                                                                        <div>
                                                                                            <FontAwesomeIcon icon={faTrain}/> {
                                                                                                leg.line
                                                                                                    ? leg.line.name
                                                                                                    : 'Unknown Train'
                                                                                            }
                                                                                            {"(" + leg.origin.name}
                                                                                            &nbsp;- {leg.destination.name + ")"}
                                                                                        </div>
                                                                                        <div>
                                                                                            <FontAwesomeIcon icon={faClock}/> {formatTime(leg.departure)}
                                                                                            &nbsp;- {formatTime(leg.arrival)}
                                                                                        </div>
                                                                                        <div>
                                                                                            <FontAwesomeIcon icon={faSubway}/>&nbsp; Platform {leg.departurePlatform || '--'}
                                                                                        </div>
                                                                                        <div>
                                                                                            <FontAwesomeIcon icon={faArrowRight}/>&nbsp; Dir.: {leg.direction}
                                                                                        </div>
                                                                                        <div>
                                                                                            <FontAwesomeIcon icon={faSignOutAlt}/>&nbsp; Exit: {
                                                                                                leg.destination
                                                                                                    ? leg.destination.name
                                                                                                    : '--'
                                                                                            }
                                                                                        </div>
                                                                                    </li>
                                                                                    {
                                                                                        legIndex < trainLegs.length - 1 && (
                                                                                            <li className="detailed-item change-info">
                                                                                                <FontAwesomeIcon icon={faExchangeAlt}/> {formatChangeInfo(leg, trainLegs[legIndex + 1])}
                                                                                            </li>
                                                                                        )
                                                                                    }
                                                                                </React.Fragment>
                                                                            ))
                                                                        }
                                                                    </ul>
                                                                    <div className="total-travel-time">
                                                                        Total Travel Time: {calculateTotalTravelTime(journey.legs)}
                                                                    </div>
                                                                    <div className="issue-count">
                                                                        Issues: {countIssues(journey.legs)}
                                                                    </div>

                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            )

                    }</div>
}/>
                <Route path="/train-details/:tripId" element={<TrainDetails />} key="tripId"/>
            </Routes>
            <div className='footer'>
                <div>
                    <FontAwesomeIcon icon={faClock}/> {formatTime(new Date())}
                    <br></br>
                    Version: {version}
                    <br></br>
                    With &#9829; by Felix Alexander
                </div>
            </div>
        </div>
    );
};

export default Test;
