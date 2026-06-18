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
    faCog,
    faLocationDot,
    faBus,
    faHourglassHalf
} from '@fortawesome/free-solid-svg-icons';
import {Route, Routes, useNavigate} from 'react-router-dom';
import {
    fetchJourneys,
    calculateTotalTravelTime,
    countIssues,
    formatTime,
    fetchSuggestions,
    getSuggestionValue,
    renderSuggestion,
    getClassForTrain,
    formatChangeInfo,
    TravelTimeDropdown,
    isDifferentArrival,
    isDifferentDeparture,
    getTripDetails
} from '../components/GetTrainData';
import {TrainDetails} from '../components/TrainDetails';
import './Test.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const version = '1.0.0 (2026-06-18)';

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
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

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
        maxResults,
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

    const handleSearch = async () => {
        setHasSearched(true);
        setLoading(true);
        try {
            if (fromId && toId) {
                console.log("TRUE")
                await fetchJourneys(
                    fromId,
                    toId,
                    travelTime,
                    setJourneys,
                    changeTime,
                    maxChanges,
                    maxResults,
                    excludedTrains,
                );
            } else {
                console.log("FALSE")
                await fetchJourneys(
                    fromId,
                    toId,
                    setJourneys
                )
            }
        } finally {
            setLoading(false);
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
                "NJ", "EN", "ICN", "D"
            ],
            icon: faTrain,
            color: "darkblue",
        }, 
        {
            types: [
                "ICE", "ECE", "RJ", "RJX"
            ],
            icon: faTrain,
            color: "red"
        }, 
        {
            types: [
                "IC", "EC"
            ],
            icon: faTrain,
            color: "red"
        }, 
        {
            types: [
                "REX", "RE", "IR", "RB"
            ],
            icon: faSubway,
            color: "blue"
        }, 
        {
            types: [
                "BRB", "RS", "R"
            ],
            icon: faSubway,
            color: "blue"
        }, 
        {
            types: ["S-Bahn"],
            icon: faSubway,
            color: "blue"
        }, 
        {
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
                                    <label>Minimum Change Time (minutes): &nbsp;</label>
                                    <input
                                        type="number"
                                        value={changeTime}
                                        onChange={handleOptionChange(setChangeTime)}/>
                                </div>
                                <div className="option-item">
                                    <label>Maximum Changes: &nbsp;</label>
                                    <input
                                        type="number"
                                        value={maxChanges}
                                        onChange={handleOptionChange(setMaxChanges)}/>
                                </div>
                                <div className='option-item'>
                                    <label>Results: &nbsp;</label>
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
                                                            {
                                                                types.length > 1
                                                                    ? types.join(' / ')
                                                                    : types[0]
                                                            }
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
                        loading
                            ? (
                                <Skeleton count={5} height={100}/> // Adjust height to match your item height
                            )
                            : hasSearched && journeys.length === 0
                                ? (<h1>No journeys were found</h1>)
                                : (
                                    <ul className="train-list">
                                        {
                                            journeys.map((journey, index) => {
                                                const trainLegs = journey
                                                    .legs
                                                    .filter(leg => !leg.walking);
                                                const firstLeg = journey.legs[0];
                                                const lastLeg = journey.legs[journey.legs.length - 1];
                                                const issueCount = countIssues(journey.legs);
                                                const nodeCount = Math.max(trainLegs.length + 1, 2);
                                                const nodePositions = Array.from({length: nodeCount}, (_, nodeIndex) => 30 + (740 / (nodeCount - 1)) * nodeIndex);

                                                return (
                                                    <li key={index} className={`train-item ${expandedTrain === index ? 'is-expanded' : ''}`}>
                                                        <div className="train-summary">
                                                            <div className="journey-hero">
                                                                <div className="journey-stations">
                                                                    <span>{firstLeg.origin?.name || '--'}</span>
                                                                    <span className="journey-divider" aria-hidden="true">→</span>
                                                                    <span>{lastLeg.destination?.name || '--'}</span>
                                                                </div>
                                                                <div className="journey-meta">
                                                                    <span className="journey-duration">
                                                                        <FontAwesomeIcon icon={faHourglassHalf}/> {calculateTotalTravelTime(journey.legs)}
                                                                    </span>
                                                                    <span className="journey-issues">
                                                                        Issues: {issueCount}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="route-graphic" aria-hidden="true">
                                                                <svg viewBox="0 0 800 80" xmlns="http://www.w3.org/2000/svg">
                                                                    <defs>
                                                                        <linearGradient id={`routeLine-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                                                            <stop offset="0%" stopColor="#0f8db8"/>
                                                                            <stop offset="100%" stopColor="#f28749"/>
                                                                        </linearGradient>
                                                                    </defs>
                                                                    <path
                                                                        id={`routeCurve-${index}`}
                                                                        d="M30 42 C160 12, 280 66, 400 42 C520 18, 640 70, 770 42"
                                                                        fill="none"
                                                                        stroke={`url(#routeLine-${index})`}
                                                                        strokeWidth="8"
                                                                        strokeLinecap="round"
                                                                    />
                                                                    {
                                                                        nodePositions.map((xPos, nodeIndex) => (
                                                                            <g key={nodeIndex}>
                                                                                <circle
                                                                                    cx={xPos}
                                                                                    cy="42"
                                                                                    r={nodeIndex === 0 || nodeIndex === nodePositions.length - 1 ? 6.5 : 4.5}
                                                                                    className={`route-station ${nodeIndex === 0 || nodeIndex === nodePositions.length - 1 ? 'is-terminal' : ''}`}
                                                                                />
                                                                                <circle
                                                                                    cx={xPos}
                                                                                    cy="42"
                                                                                    r={nodeIndex === 0 || nodeIndex === nodePositions.length - 1 ? 8.5 : 6.5}
                                                                                    className="route-station-pulse"
                                                                                    style={{animationDelay: `${nodeIndex * 0.25}s`}}
                                                                                />
                                                                            </g>
                                                                        ))
                                                                    }
                                                                    <circle cx="30" cy="42" r="8" fill="#0f8db8"/>
                                                                    <circle cx="770" cy="42" r="8" fill="#f28749"/>
                                                                    <circle r="5" className="route-runner">
                                                                        <animateMotion dur="7s" repeatCount="indefinite" rotate="auto">
                                                                            <mpath href={`#routeCurve-${index}`}/>
                                                                        </animateMotion>
                                                                    </circle>
                                                                </svg>
                                                            </div>
                                                            <div className="mobile-timeline" aria-label="Compact route timeline">
                                                                {
                                                                    trainLegs.map((leg, legIndex) => (
                                                                        <div key={`mobile-${legIndex}`} className="mobile-timeline-item">
                                                                            <span className={`mobile-line-pill ${getClassForTrain(leg.line)}`}>
                                                                                {leg.line ? leg.line.name : 'Train'}
                                                                            </span>
                                                                            <span className="mobile-station-name">{leg.origin?.name || '--'}</span>
                                                                            <span className="mobile-time">{formatTime(leg.departure)}</span>
                                                                        </div>
                                                                    ))
                                                                }
                                                                <div className="mobile-timeline-item mobile-arrival">
                                                                    <span className="mobile-arrival-label">Arrival</span>
                                                                    <span className="mobile-station-name">{lastLeg.destination?.name || '--'}</span>
                                                                    <span className="mobile-time">{formatTime(lastLeg.arrival)}</span>
                                                                </div>
                                                            </div>
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
                                                            <div className="train-time-grid">
                                                                <div className="train-time-row">
                                                                    <span className="train-time-label">
                                                                        <FontAwesomeIcon icon={faClock}/>&nbsp;Departure
                                                                    </span>
                                                                    <span className="train-time-value">
                                                                        {
                                                                            isDifferentDeparture(firstLeg)
                                                                                ? (
                                                                                    <>
                                                                                        <span className="train-time-planned">{formatTime(firstLeg.plannedDeparture)}</span>
                                                                                        <span className="train-time-live is-delayed">{formatTime(firstLeg.departure)}</span>
                                                                                    </>
                                                                                )
                                                                                : (
                                                                                    <span className="train-time-live is-on-time">{formatTime(firstLeg.departure)}</span>
                                                                                )
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="train-time-row">
                                                                    <span className="train-time-label">
                                                                        <FontAwesomeIcon icon={faClock}/>&nbsp;Arrival
                                                                    </span>
                                                                    <span className="train-time-value">
                                                                        {
                                                                            isDifferentArrival(lastLeg)
                                                                                ? (
                                                                                    <>
                                                                                        <span className="train-time-planned">{formatTime(lastLeg.plannedArrival)}</span>
                                                                                        <span className="train-time-live is-delayed">{formatTime(lastLeg.arrival)}</span>
                                                                                    </>
                                                                                )
                                                                                : (
                                                                                    <span className="train-time-live is-on-time">{formatTime(lastLeg.arrival)}</span>
                                                                                )
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="train-times-footer">
                                                                <div className="issue-count">
                                                                    Issues: {issueCount}
                                                                </div>
                                                                <div className="toggle-details" onClick={() => toggleDetails(index)} aria-expanded={expandedTrain === index}>
                                                                    <span>Details</span>
                                                                    <FontAwesomeIcon
                                                                        icon={expandedTrain === index
                                                                            ? faChevronUp
                                                                            : faChevronDown}
                                                                        className="toggle-icon"/>
                                                                </div>
                                                            </div>
                                                            <div className={`train-details ${expandedTrain === index ? 'is-open' : ''}`}>
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
                                                                                            className={`detailed-item leg-stagger cursor-pointer ${getClassForTrain(leg.line)}`}
                                                                                            style={{animationDelay: `${legIndex * 90}ms`}}
                                                                                            onClick={() => redirectToTripDetails(leg)}>
                                                                                            <div className="leg-card-head">
                                                                                                <div>
                                                                                                    <FontAwesomeIcon icon={faTrain}/> {
                                                                                                        leg.line
                                                                                                            ? leg.line.name
                                                                                                            : 'Unknown Train'
                                                                                                    }
                                                                                                </div>
                                                                                                <div className="leg-card-time">{formatTime(leg.departure)} - {formatTime(leg.arrival)}</div>
                                                                                            </div>
                                                                                            <div className="leg-card-route">{leg.origin.name} - {leg.destination.name}</div>
                                                                                            <div className="leg-card-grid">
                                                                                                <div>
                                                                                                    <FontAwesomeIcon icon={faSubway}/>&nbsp; Platform {leg.departurePlatform || '--'}
                                                                                                </div>
                                                                                                <div>
                                                                                                    <FontAwesomeIcon icon={faArrowRight}/>&nbsp; Dir.: {leg.direction || '--'}
                                                                                                </div>
                                                                                                <div>
                                                                                                    <FontAwesomeIcon icon={faSignOutAlt}/>&nbsp; Exit: {
                                                                                                        leg.destination
                                                                                                            ? leg.destination.name
                                                                                                            : '--'
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </li>
                                                                                        {
                                                                                            legIndex < trainLegs.length - 1 && (
                                                                                                <li className="detailed-item change-info leg-stagger" style={{animationDelay: `${legIndex * 90 + 45}ms`}}>
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
