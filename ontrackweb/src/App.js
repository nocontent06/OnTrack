import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrain, faClock, faSubway, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import React, { useState } from 'react';

import Autosuggest from 'react-autosuggest';
import {
  fetchJourneys,
  onSuggestionsFetchRequested,
  onSuggestionsClearRequested,
  getSuggestionValue,
  renderSuggestion,
  onSuggestionSelected,
  formatTime,
} from './components/GetTrainData';
import './App.css';

const App = () => {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [fromId, setFromId] = useState(null);
  const [toId, setToId] = useState(null);
  const [journeys, setJourneys] = useState([]);

  const handleSearch = () => {
    fetchJourneys(fromId, toId, setJourneys);
  };

  const getClassForTrain = (line) => {
    if (!line) return 'no-background';
    const trainType = line.productName || '';

    if (['IC', 'EC', 'ICE', 'RJ', 'RJX', "D"].includes(trainType)) {
      return 'red-background';
    } else if (['RE', 'REX', 'R', 'RB', 'BRB', 'S'].includes(trainType)) {
      return 'blue-background';
    } else if (['NJ', 'EN'].includes(trainType)) {
      return 'dark-blue-background';
    } else if (['Bus'].includes(trainType)) {
      return 'gray-background';
    } else {
      return 'no-background';
    }
  };

  return (
    <div className="app">
      <h1>Search for Train Journeys</h1>
      <div className="input-group">
        <Autosuggest
          suggestions={fromSuggestions}
          onSuggestionsFetchRequested={(value) => onSuggestionsFetchRequested(value, setFromSuggestions)}
          onSuggestionsClearRequested={() => onSuggestionsClearRequested(setFromSuggestions)}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={onSuggestionSelected(setFromId)}
          inputProps={{
            placeholder: 'From...',
            value: fromQuery,
            onChange: (e, { newValue }) => setFromQuery(newValue),
          }}
          className="search-input"
        />
        <Autosuggest
          suggestions={toSuggestions}
          onSuggestionsFetchRequested={(value) => onSuggestionsFetchRequested(value, setToSuggestions)}
          onSuggestionsClearRequested={() => onSuggestionsClearRequested(setToSuggestions)}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={onSuggestionSelected(setToId)}
          inputProps={{
            placeholder: 'To...',
            value: toQuery,
            onChange: (e, { newValue }) => setToQuery(newValue),
          }}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      <ul className="results-list">
        {journeys.map((journey, index) => (
          <li key={index}>
            <h2>Journey {index + 1}</h2>
            <ul>
              {journey.legs.map((leg, legIndex) => {
                const isChange = !leg.line;
                const previousLeg = journey.legs[legIndex - 1];
                const nextLeg = journey.legs[legIndex + 1];
                const defaultClassName = 'detailed-item';
                const className = isChange
                  ? 'no-background'
                  : getClassForTrain(leg.line);

                return (
                  <li key={legIndex} className={[className, defaultClassName].join(' ')}>
                    {isChange ? (
                      <div>
                        Change from {previousLeg ? previousLeg.arrivalPlatform : '--'} to {nextLeg ? nextLeg.departurePlatform : '--'}
                      </div>
                    ) : (
                      <div>
                        <div>
                          <FontAwesomeIcon icon={faTrain} /> {leg.line.name}
                        </div>
                        <div>
                          <FontAwesomeIcon icon={faClock} /> {formatTime(leg.departure)}
                        </div>
                        <div>
                          <FontAwesomeIcon icon={faSubway} /> Platform {leg.departurePlatform || '--'}
                        </div>
                        <div>
                          <FontAwesomeIcon icon={faArrowRight} /> Dir.: {leg.direction}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default App;



////////////////////////////
// Munchen Hbf            Mainz Hbf
// ID: 8000261             8000240  
// 11.558744 48.140364    8.258453 50.001239
// https://v5.db.transport.rest/journeys?from=8013456&to=8000240

// const handleKeyPress = (e) => {
  //if (e.key === 'Enter') {
    //fetchData(query);
  //}
//};