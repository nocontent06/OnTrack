import {useState} from 'react';
import Autosuggest from 'react-autosuggest';

// Helper function to fetch suggestions
export const fetchSuggestions = async (query, setSuggestions) => {
    try {
        const response = await fetch(
            `https://v6.db.transport.rest/locations?poi=false&addresses=false&query=${query}`
        );
        const result = await response.json();
        setSuggestions(result);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
};

// Helper function to format date string
export const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date
        .getHours()
        .toString()
        .padStart(2, '0');
    const minutes = date
        .getMinutes()
        .toString()
        .padStart(2, '0');
    return `${hours}:${minutes}`;
};

// Event handler for fetching suggestions
export const onSuggestionsFetchRequested = ({
    value
}, setSuggestions) => {
    fetchSuggestions(value, setSuggestions);
};

// Event handler for clearing suggestions
export const onSuggestionsClearRequested = (setSuggestions) => {
    setSuggestions([]);
};

// Function to get suggestion value
export const getSuggestionValue = (suggestion) => suggestion.name;

// Function to render a suggestion
export const renderSuggestion = (suggestion) => (
    <div>
        {suggestion.name}
    </div>
);

// Event handler for selecting a suggestion
export const onSuggestionSelected = (setId) => (event, {suggestion}) => {
    setId(suggestion.id);
};

// components/GetTrainData.js Helper function to fetch platform details
const fetchPlatformDetails = async (fromId, toId) => {
    try {
        const response = await fetch(
            `https://v6.db.transport.rest/journeys?from=${fromId}&to=${toId}`
        );
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching platform details:', error);
        return {};
    }
};

// Function to fetch journeys
export const fetchJourneys = async (fromId, toId, setJourneys) => {
    try {
        const response = await fetch(
            `https://v6.db.transport.rest/journeys?from=${fromId}&to=${toId}`
        );
        const result = await response.json();

        // Fetch platform details if walking is true
        if (result.walking) {
            const platformDetails = await fetchPlatformDetails(fromId, toId);
            // Optionally integrate platform details into the result
            result.journeys = integratePlatformDetails(result.journeys, platformDetails);
        }

        setJourneys(result.journeys);
    } catch (error) {
        console.error('Error fetching journeys:', error);
    }
};

// Optionally, you can integrate platform details into the journey legs
const integratePlatformDetails = (journeys, platformDetails) => {
    // Implement logic to merge platform details with journeys if necessary
    return journeys;
};

const fetchArrivalPlatform = async (fromId, toId) => {
    try {
        const response = await fetch(
            `https://v6.db.transport.rest/journeys?from=${fromId}&to=${toId}`
        );
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching platform details:', error);
        return {};
    }
};