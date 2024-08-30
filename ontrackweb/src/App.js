// import React, { useState } from 'react';
// import Autosuggest from 'react-autosuggest';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrain, faClock, faSubway, faArrowRight, faHourglassHalf, faExchangeAlt, faSignOutAlt, faExclamationTriangle, faCheck, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

// import {
//   fetchJourneys,
//   onSuggestionsFetchRequested,
//   onSuggestionsClearRequested,
//   getSuggestionValue,
//   renderSuggestion,
//   formatTime,
//   calculateChangeTime,
//   calculateTotalTravelTime,
//   calculateChangeTimeInMinutes,
//   countIssues,
// } from './components/GetTrainData';
// import './App.css';

// const App = () => {
//   const [fromQuery, setFromQuery] = useState('');
//   const [toQuery, setToQuery] = useState('');
//   const [fromSuggestions, setFromSuggestions] = useState([]);
//   const [toSuggestions, setToSuggestions] = useState([]);
//   const [fromId, setFromId] = useState(null);
//   const [toId, setToId] = useState(null);
//   const [journeys, setJourneys] = useState([]);
//   const [expandedJourneys, setExpandedJourneys] = useState({});

//   const handleSearch = () => {
//     fetchJourneys(fromId, toId, setJourneys);
//   };

//   const toggleJourney = (index) => {
//     setExpandedJourneys(prevState => ({
//       ...prevState,
//       [index]: !prevState[index]
//     }));
//   };

//   const getClassForTrain = (line) => {
//     if (!line) return 'no-background';
//     const trainType = line.productName || '';
  
//     if (trainType.includes('BusSV')) {
//       return 'yellow-background';
//     } else if (['IC', 'EC', 'ICE', 'RJ', 'RJX', 'D', 'FR'].includes(trainType)) {
//       return 'red-background';
//     } else if (['RE', 'REX', 'R', 'RB', 'BRB', 'S'].includes(trainType)) {
//       return 'blue-background';
//     } else if (['NJ', 'EN'].includes(trainType)) {
//       return 'dark-blue-background';
//     } else if (['Bus'].includes(trainType)) {
//       return 'gray-background';
//     } else if (['WB'].includes(trainType)) {
//       return 'wb-background';
//     } else {
//       return 'no-background';
//     }
//   };

//   return (
//     <div className="app">
//       <h1>Search for Train Journeys</h1>
//       <div className="input-group">
//         <Autosuggest
//           suggestions={fromSuggestions}
//           onSuggestionsFetchRequested={(value) => onSuggestionsFetchRequested(value, setFromSuggestions)}
//           onSuggestionsClearRequested={() => onSuggestionsClearRequested(setFromSuggestions)}
//           getSuggestionValue={getSuggestionValue}
//           renderSuggestion={renderSuggestion}
//           onSuggestionSelected={(event, { suggestion }) => setFromId(suggestion.id)}
//           inputProps={{
//             placeholder: 'From...',
//             value: fromQuery,
//             onChange: (e, { newValue }) => setFromQuery(newValue),
//           }}
//           className="search-input"
//         />
//         <Autosuggest
//           suggestions={toSuggestions}
//           onSuggestionsFetchRequested={(value) => onSuggestionsFetchRequested(value, setToSuggestions)}
//           onSuggestionsClearRequested={() => onSuggestionsClearRequested(setToSuggestions)}
//           getSuggestionValue={getSuggestionValue}
//           renderSuggestion={renderSuggestion}
//           onSuggestionSelected={(event, { suggestion }) => setToId(suggestion.id)}
//           inputProps={{
//             placeholder: 'To...',
//             value: toQuery,
//             onChange: (e, { newValue }) => setToQuery(newValue),
//           }}
//           className="search-input"
//         />
//         <button onClick={handleSearch} className="search-button">Search</button>
//       </div>
//       <ul className="results-list">
//         {journeys.map((journey, index) => {
//           const totalTravelTime = calculateTotalTravelTime(journey.legs);
//           const issues = countIssues(journey.legs);
//           const isExpanded = expandedJourneys[index];

//           return (
//             <li key={index} className="journey-item">
//               <div className="journey-header" onClick={() => toggleJourney(index)}>
//                 <h2>
//                   Journey {index + 1} - {totalTravelTime} - {formatTime(journey.legs[0].departure)}
//                   {issues > 0 && (
//                     <span className="warning-header">
//                       <br /><FontAwesomeIcon icon={faExclamationTriangle} style={{ color: 'yellow' }} /> {issues} Issue{issues > 1 ? 's' : ''} on the Journey
//                     </span>
//                   )}
//                   {issues === 0 && (
//                     <span className="warning-header">
//                       <br /><FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} /> No Issues on the Journey
//                     </span>
//                   )}
//                 </h2>
//                 <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="toggle-icon" />
//               </div>
//               {isExpanded && (
//                 <ul className="journey-details">
//                   {journey.legs.map((leg, legIndex) => {
//                     const isChange = !leg.line;
//                     const previousLeg = journey.legs[legIndex - 1];
//                     const nextLeg = journey.legs[legIndex + 1];
//                     const defaultClassName = 'detailed-item';
//                     const className = isChange
//                       ? 'no-background'
//                       : getClassForTrain(leg.line);

//                     return (
//                       <li key={legIndex} className={[className, defaultClassName].join(' ')}>
//                         {isChange ? (
//                           <div>
//                             <div>
//                               Change from Pl. {previousLeg ? previousLeg.arrivalPlatform : '--'} to Pl. {nextLeg ? nextLeg.departurePlatform : '--'}
//                             </div>
//                             {previousLeg && nextLeg && (
//                               <div>
//                                 <FontAwesomeIcon icon={faExchangeAlt} /> Change time: {calculateChangeTime(previousLeg.arrival, nextLeg.departure)}
//                                 {calculateChangeTimeInMinutes(previousLeg.arrival, nextLeg.departure) > 60 && (
//                                   <div style={styles.warning}>
//                                     <FontAwesomeIcon icon={faExclamationTriangle} /> This connection may not be ideal
//                                   </div>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         ) : (
//                           <div>
//                             <div>
//                               <FontAwesomeIcon icon={faTrain} /> {leg.line.name}
//                             </div>
//                             <div>
//                               <FontAwesomeIcon icon={faClock} /> {formatTime(leg.departure)} - {formatTime(leg.arrival)}
//                             </div>
//                             <div>
//                               <FontAwesomeIcon icon={faSubway} /> Platform {leg.departurePlatform || '--'}
//                             </div>
//                             <div>
//                               <FontAwesomeIcon icon={faArrowRight} /> Dir.: {leg.direction}
//                             </div>
//                             <div>
//                               <FontAwesomeIcon icon={faSignOutAlt} /> Exit: {leg.destination.name || '--'}
//                             </div>
//                           </div>
//                         )}
//                       </li>
//                     );
//                   })}
//                   <li className="no-background">
//                     <div>
//                       <FontAwesomeIcon icon={faHourglassHalf} /> Total Travel Time: {totalTravelTime}
//                     </div>
//                   </li>
//                 </ul>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// const styles = {
//   warning: {
//     backgroundColor: 'yellow',
//     padding: '10px',
//     marginTop: '5px',
//     borderRadius: '4px',
//     display: 'flex',
//     alignItems: 'center',
//   },
//   warningHeader: {
//     display: 'flex',
//     alignItems: 'center',
//     color: 'orange', // Use color to highlight issues
//   },
// };

// export default App;






// ////////////////////////////
// // Munchen Hbf            Mainz Hbf
// // ID: 8000261             8000240  
// // 11.558744 48.140364    8.258453 50.001239
// // https://v5.db.transport.rest/journeys?from=8013456&to=8000240

// // const handleKeyPress = (e) => {
//   //if (e.key === 'Enter') {
//     //fetchData(query);
//   //}
// //};


// App.js
// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Test from './Test/Test'; // Your Test component
import TrainDetails from './components/TrainDetails'; // Ensure this is a default import
import './Test/Test.css';
import './App.css'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Test />} />
                <Route path="/train-details" element={<TrainDetails />} />
                {/* Other routes */}
            </Routes>
        </Router>
    );
};

export default App;
