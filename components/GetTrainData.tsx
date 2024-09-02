import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Picker, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrain, faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

// Helper function to fetch suggestions
export const fetchSuggestions = async (query: string, setSuggestions: (suggestions: any[]) => void) => {
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
export const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

// Event handler for fetching suggestions
export const onSuggestionsFetchRequested = (
    { value }: { value: string },
    setSuggestions: (suggestions: any[]) => void
) => {
    fetchSuggestions(value, setSuggestions);
};

// Event handler for clearing suggestions
export const onSuggestionsClearRequested = (setSuggestions: (suggestions: any[]) => void) => {
    setSuggestions([]);
};

// Function to get suggestion value
export const getSuggestionValue = (suggestion: any) => suggestion.name;

// Function to render a suggestion
export const renderSuggestion = (suggestion: any) => (
    <View style={styles.suggestion}>
        <Text>{suggestion.name}</Text>
    </View>
);

// Event handler for selecting a suggestion
export const onSuggestionSelected = (setId: (id: string) => void) => (event: any, { suggestion }: any) => {
    setId(suggestion.id);
};

// Function to fetch journeys
export const fetchJourneys = async (
    fromId: string,
    toId: string,
    travelTime: string,
    setJourneys: (journeys: any[]) => void,
    changeTime: number,
    maxChanges: number,
    maxResults: number,
    excludedTrains: string[]
) => {
    try {
        let url = `https://v6.db.transport.rest/journeys?from=${fromId}&to=${toId}`;
        if (travelTime) {
            url += `&departure=${travelTime}`;
        }
        if (changeTime) {
            url += `&transferTime=${changeTime}`;
        }
        if (maxChanges) {
            url += `&transfers=${maxChanges}`;
        }
        if (maxResults) {
            url += `&results=${maxResults}`;
        }
        for (const train of excludedTrains) {
            if (train === 'ICE') {
                url += `&nationalExpress=false`;
            }
            if (train === 'IC') {
                url += `&national=false`;
            }
        }

        const response = await fetch(url);
        const result = await response.json();

        if (result.journeys === undefined) {
            result.journeys = [];
        }

        // Fetch platform details if walking is true
        if (result.walking) {
            const platformDetails = await fetchPlatformDetails(fromId, toId);
            result.journeys = integratePlatformDetails(result.journeys, platformDetails);
        }

        setJourneys(result.journeys);
    } catch (error) {
        console.error('Error fetching journeys:', error);
    }
};

// Helper function to fetch platform details
const fetchPlatformDetails = async (fromId: string, toId: string) => {
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

// Function to integrate platform details
const integratePlatformDetails = (journeys: any[], platformDetails: any) => {
    // Implement logic to merge platform details with journeys if necessary
    return journeys;
};

// Function to calculate change time
export const calculateChangeTime = (arrival: string, departure: string) => {
    const arrivalTime = new Date(arrival);
    const departureTime = new Date(departure);
    const duration = Math.abs(departureTime.getTime() - arrivalTime.getTime());
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
};

// Function to calculate total travel time
export const calculateTotalTravelTime = (legs: any[]) => {
    if (!legs || legs.length === 0) return '--';
    const departureTime = new Date(legs[0].departure);
    const arrivalTime = new Date(legs[legs.length - 1].arrival);
    const duration = Math.abs(arrivalTime.getTime() - departureTime.getTime());
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
};

// Function to get trip details
export const getTripDetails = (leg: any) => {
    if (!leg || leg.length === 0) return '--';
    const tripId = leg.tripId;
    return tripId;
};

// Function to calculate change time in minutes
export const calculateChangeTimeInMinutes = (arrival: string, departure: string) => {
    const arrivalTime = new Date(arrival);
    const departureTime = new Date(departure);
    const durationInMs = departureTime.getTime() - arrivalTime.getTime();
    return Math.floor(durationInMs / 1000 / 60); // Convert milliseconds to minutes
};

// Dropdown component for travel time
export const TravelTimeDropdown = ({ travelTime, handleTravelTimeChange }: { travelTime: string, handleTravelTimeChange: (value: string) => void }) => {
    const timeOptions = ["now"]; // Add "now" as the first option

    // Generate time options from "00:00" to "23:00"
    for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0');
        timeOptions.push(`${hour}:00`);
    }

    return (
        <Picker
            selectedValue={travelTime}
            onValueChange={(itemValue) => handleTravelTimeChange(itemValue)}
            style={styles.dropdown}
        >
            {timeOptions.map((time, index) => (
                <Picker.Item key={index} label={time} value={time} />
            ))}
        </Picker>
    );
};

// Function to count issues
export const countIssues = (legs: any[]) => {
    if (!legs || legs.length === 0) return 0;

    let issueCount = 0;

    for (let i = 0; i < legs.length - 1; i++) {
        const currentLeg = legs[i];
        const nextLeg = legs[i + 1];

        if (currentLeg && nextLeg) {
            const changeTimeInMinutes = calculateChangeTimeInMinutes(
                currentLeg.arrival,
                nextLeg.departure
            );
            if (changeTimeInMinutes > 60) {
                issueCount++;
            }

            if (isDifferentArrival(currentLeg)) {
                issueCount++;
            }
        }
    }

    const lastLeg = legs[legs.length - 1];
    if (lastLeg && (isDifferentArrival(lastLeg) || isDifferentDeparture(lastLeg))) {
        issueCount++;
    }

    return issueCount;
};

// Function to get class for train
export const getClassForTrain = (line: any) => {
    if (!line) return 'no-background';
    const trainType = line.productName || '';
    const trainName = line.name || '';

    if (trainName.includes('BusSV')) {
        return 'yellow-background';
    }
    if (['IC', 'EC', 'ICE', 'RJ', 'RJX', 'D', 'FR', 'TGV'].includes(trainType)) {
        return 'red-background';
    } else if (['RE', 'REX', 'R', 'RB', 'BRB', 'S', 'CJX'].includes(trainType)) {
        return 'blue-background';
    } else if (['NJ', 'EN', 'ICN'].includes(trainType)) {
        return 'dark-blue-background';
    } else if (['Bus'].includes(trainType)) {
        return 'gray-background';
    } else if (['WB'].includes(trainType)) {
        return 'wb-background';
    } else {
        return 'no-background';
    }
};

// Function to format change duration
export const formatChangeDuration = (arrivalTime: string, departureTime: string) => {
    const arrivalDate = new Date(arrivalTime);
    const departureDate = new Date(departureTime);
    const differenceInMillis = departureDate.getTime() - arrivalDate.getTime();
    const differenceInMinutes = Math.round(differenceInMillis / (1000 * 60));
    const hours = Math.floor(differenceInMinutes / 60);
    const minutes = differenceInMinutes % 60;
    return `${hours}h ${minutes}min`;
};

// Function to format change info
export const formatChangeInfo = (prevLeg: any, nextLeg: any) => {
    const arrivalPlatform = prevLeg.departurePlatform || '--';
    const departurePlatform = nextLeg.departurePlatform || '--';
    const arrivalTime = formatTime(prevLeg.arrival);
    const departureTime = formatTime(nextLeg.departure);
    const changeDuration = calculateChangeTime(prevLeg.arrival, nextLeg.departure);

    return (
        <View style={styles.changeInfo}>
            <Text>{`Change from ${arrivalPlatform} to ${departurePlatform} (${arrivalTime} - ${departureTime})`}</Text>
            <Text>{`Change Duration: ${formatChangeDuration(prevLeg.arrival, nextLeg.departure)}`}</Text>
            {calculateChangeTimeInMinutes(prevLeg.arrival, nextLeg.departure) > 60 && (
                <View style={styles.warning}>
                    <FontAwesomeIcon icon={faExclamationTriangle} size={16} color="red" />
                    <Text style={styles.warningText}>Long Change Time</Text>
                </View>
            )}
        </View>
    );
};

// Function to check if arrival time is different from planned arrival time
export const isDifferentArrival = (leg: any) => {
    return leg.plannedArrival !== leg.arrival;
};

// Function to check if departure time is different from planned departure time
export const isDifferentDeparture = (leg: any) => {
    return leg.plannedDeparture !== leg.departure;
};

// Styles
const styles = StyleSheet.create({
    suggestion: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    dropdown: {
        height: 50,
        width: '100%',
    },
    changeInfo: {
        padding: 10,
    },
    warning: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    warningText: {
        marginLeft: 5,
        color: 'red',
    },
});

export default GetTrainData;
