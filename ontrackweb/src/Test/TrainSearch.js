import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { fetchTrains } from '../components/GetTrains';
import './Test.css'; // Updated CSS file

const TrainSearch = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [trainData, setTrainData] = useState([]);

    const handleSuggestionsFetchRequested = async ({ value }) => {
        try {
            const data = await fetchTrains(value);
            setSuggestions(data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const handleInputChange = (event, { newValue }) => {
        setQuery(newValue);
    };

    const handleSearch = async () => {
        try {
            const data = await fetchTrains(query);
            setTrainData(data);
        } catch (error) {
            console.error('Error fetching train data:', error);
        }
    };

    return (
        <div className="train-search">
            <h1 className="title">Search Trains</h1>
            <div className="input-group">
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
                    onSuggestionsClearRequested={handleSuggestionsClearRequested}
                    getSuggestionValue={(suggestion) => suggestion.name}
                    renderSuggestion={(suggestion) => <div>{suggestion.name}</div>}
                    inputProps={{
                        placeholder: 'Search for trains...',
                        value: query,
                        onChange: handleInputChange,
                    }}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">
                    <FontAwesomeIcon icon={faSearch} /> Search
                </button>
            </div>
            <div className="train-list">
                {trainData.length > 0 && (
                    <ul>
                        {trainData.map((train, index) => (
                            <li key={index}>
                                <div><strong>Train ID:</strong> {train.id}</div>
                                <div><strong>Departure:</strong> {train.departure}</div>
                                <div><strong>Arrival:</strong> {train.arrival}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TrainSearch;
