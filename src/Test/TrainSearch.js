import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrain } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './Test.css'; // Updated CSS file
import { Route, Routes } from 'react-router-dom';
import API_BASE_URL from '../components/API_BASE_URL.js';

console.log("HELLO")

let responseStatus = "" 

const fetchTrains = async (query, retries = 3) => {
    let attempt = 0;
    
    while (attempt < retries) {
        try {
            const response = await fetch(`${API_BASE_URL}/trips?query=${query}&onlyCurrentlyRunning=false&stopovers=true`);
            if (!response.ok) {
                console.log(`Attempt ${attempt + 1} failed... Status code: ${response.status}`);
                responseStatus = response.status
                throw new Error('Network response was not ok... Status code: ' + response.status);
            }
            const data = await response.json();

            // Create a map to filter out duplicate trains based on train name
            const uniqueTrains = new Map();

            data.trips.forEach((trip) => {
                const trainName = trip.line.name;
                const trainDetails = {
                    id: trip.id,
                    departure: trip.stopovers[0]?.plannedDeparture,
                    arrival: trip.stopovers[trip.stopovers.length - 1]?.plannedArrival,
                    date: trip.stopovers[0]?.plannedDeparture || 'N/A',
                    from: trip.origin.name,
                    to: trip.destination.name,
                };

                // Check if trainName already exists in the map
                if (!uniqueTrains.has(trainName)) {
                    uniqueTrains.set(trainName, {
                        name: trainName,
                        trips: [trainDetails], // Initialize with the first trip
                    });
                } else {
                    uniqueTrains.get(trainName).trips.push(trainDetails); // Add additional trip details
                }
            });

            // Convert Map values to an array, but keep the trip details
            return Array.from(uniqueTrains.values());
        } catch (error) {
            attempt++;
            if (attempt >= retries) {
                console.error('Max retries reached. Could not fetch data:', error);
                throw error;
            }
        }
    }
};


const TrainSearch = () => {
    const [query, setQuery] = useState('');
    const [trainData, setTrainData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noResultsMessage, setNoResultsMessage] = useState('');

    // Handle input changes for the search field
    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    // Fetch the train data on search button click
    const handleSearch = async () => {
        setLoading(true);
        setTrainData([]); // Clear previous results
        setNoResultsMessage(''); // Clear no results message
        try {
            const data = await fetchTrains(query);
            setTrainData(data); // Set the complete train data
            console.log('Fetched train data:', data);
            if (data.length === 0) {
                setNoResultsMessage('No trains found for your search.' + responseStatus);
            }
        } catch (error) {
            console.error('Error fetching train data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='app'>
            <Routes>
                <Route
                    path='/'
                    element={
                        <div className="train-search">
                            <h1 className="title">Search Trains</h1>
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Search for trains..."
                                    value={query}
                                    onChange={handleInputChange}
                                    className="search-input"
                                />
                                <button onClick={handleSearch} className="search-button">
                                    <FontAwesomeIcon icon={faSearch} /> Search
                                </button>
                            </div>
                            <h3>{noResultsMessage}</h3>
                            <div>
                                {loading ? (
                                    <Skeleton count={5} height={30} />
                                ) : trainData.length === 0 ? (
                                    <h1>{noResultsMessage}</h1>
                                ) : (
                                    <ul className='train-list'>
                                        <h3>{trainData.length} Results for "{query}"</h3>
                                        {trainData.map((trip, index) => (
                                            trip.trips.map((tripDetail, tripIndex) => (
                                                <li key={`${index}-${tripIndex}`} className='train-item'>
                                                    <div className='train-summary'>
                                                        <div className='train-line-container'>
                                                            <FontAwesomeIcon icon={faTrain} className='train-icon' style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }} /> &nbsp; {trainData[index].name}
                                                        </div>
                                                        <div className='train-details'>
                                                            <p>From: {tripDetail.from ? tripDetail.from : 'Unknown Origin'}</p>
                                                            <p>To: {tripDetail.to ? tripDetail.to : 'Unknown Destination'}</p>
                                                            <p>Departure: {formatDate(tripDetail.departure)}</p>
                                                            <p>Arrival: {formatDate(tripDetail.arrival)}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    }
                />
            </Routes>
        </div>
    );
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
        return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
};

export default TrainSearch;






/* <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
                            onSuggestionsClearRequested={handleSuggestionsClearRequested}
                            getSuggestionValue={(suggestion) => suggestion.name}
                            renderSuggestion={(suggestion) => <div>{suggestion.name}</div>}
                            inputProps={{
                                placeholder: 'Search for trains...',
                                value: query,
                                onChange: handleInputChange
                            }}
                            className="search-input"/> */
