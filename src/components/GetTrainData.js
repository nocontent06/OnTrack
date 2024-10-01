import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';

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
        const response = await fetch(`/journeys?from=${fromId}&to=${toId}`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching platform details:', error);
        return {};
    }
};

// Function to fetch journeys
export const fetchJourneys = async (
    fromId,
    toId,
    travelTime,
    setJourneys,
    changeTime,
    maxChanges,
    maxResults,
    excludedTrains
) => {
    try {

        if (!excludedTrains) {
            excludedTrains = [];
        }

        // Construct the URL based on whether travelTime is provided
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

        let nationalExpressExcluded = false;
        let nationalExcluded = false;
        let regionalExpressExcluded = false;
        let regionalExcluded = false;
        let suburbanExcluded = false;
        let busExcluded = false;

        for (const train of excludedTrains) {
            switch (train) {
                case "ICE":
                case "ECE":
                case "RJ":
                case "RJX":
                    if (!nationalExpressExcluded) {
                        url += `&nationalExpress=false`;
                        nationalExpressExcluded = true;
                    }
                    break;
                case "IC":
                case "EC":
                    if (!nationalExcluded) {
                        url += `&national=false`;
                        nationalExcluded = true;
                    }
                    break;
                case "RE":
                case "IR":
                case "RB":
                case "D":
                    if (!regionalExpressExcluded) {
                        url += `&regionalExpress=false`;
                        regionalExpressExcluded = true;
                    }
                    break;
                case "BRB":
                case "RS":
                case "R":
                    if (!regionalExcluded) {
                        url += `&regional=false`;
                        regionalExcluded = true;
                    }
                    break;
                case "S-Bahn":
                    if (!suburbanExcluded) {
                        url += `&suburban=false`;
                        suburbanExcluded = true;
                    }
                    break;
                case "Bus":
                    if (!busExcluded) {
                        url += `&bus=false`;
                        busExcluded = true;
                    }
                    break;
                default:
                    break;
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
            // Optionally integrate platform details into the result
            result.journeys = integratePlatformDetails(result.journeys, platformDetails);
        }

        setJourneys(result.journeys);
        console.log('Final URL: ' + url);
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

const calculateChangeTimeInMin = (journey) => {}

export const calculateChangeTime = (arrival, departure) => {
    const arrivalTime = new Date(arrival);
    const departureTime = new Date(departure);
    const duration = Math.abs(departureTime - arrivalTime);
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
};

export const calculateTotalTravelTime = (legs) => {
    if (!legs || legs.length === 0) 
        return '--';
    const departureTime = new Date(legs[0].departure);
    const arrivalTime = new Date(legs[legs.length - 1].arrival);
    const duration = Math.abs(arrivalTime - departureTime);
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
};

export const getTripDetails = (leg) => {
    if (!leg || leg.length === 0) 
        return '--';
    const tripId = leg.tripId;
    return tripId;
}

export const calculateChangeTimeInMinutes = (arrival, departure) => {
    const arrivalTime = new Date(arrival);
    const departureTime = new Date(departure);
    const durationInMs = departureTime - arrivalTime;
    return Math.floor(durationInMs / 1000 / 60); // Convert milliseconds to minutes
};

export const TravelTimeDropdown = ({travelTime, handleTravelTimeChange}) => {
    const timeOptions = ["now"]; // Add "now" as the first option

    // Generate time options from "00:00" to "23:00"
    for (let i = 0; i < 24; i++) {
        const hour = i
            .toString()
            .padStart(2, '0');
        timeOptions.push(`${hour}:00`);
    }

    return (
        <select
            value={travelTime}
            onChange={handleTravelTimeChange}
            className="travel-time-dropdown">
            {
                timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                        {time}
                    </option>
                ))
            }
        </select>
    );
};

export const countIssues = (legs) => {
    if (!legs || legs.length === 0) 
        return 0;
    
    let issueCount = 0;

    for (let i = 0; i < legs.length - 1; i++) {
        const currentLeg = legs[i];
        const nextLeg = legs[i + 1];

        if (currentLeg && nextLeg) {
            // Check if change time is greater than 60 minutes
            const changeTimeInMinutes = calculateChangeTimeInMinutes(
                currentLeg.arrival,
                nextLeg.departure
            );
            if (changeTimeInMinutes > 60) {
                issueCount++;
            }

            // Check if the arrival time is different from the planned arrival time
            if (isDifferentArrival(currentLeg)) {
                issueCount++;
            }
        }
    }

    // Also check the last leg for arrival issues
    const lastLeg = legs[legs.length - 1];
    console.log("lastLeg", lastLeg.departure, lastLeg.plannedDeparture)
    if (lastLeg && isDifferentArrival(lastLeg) || lastLeg && isDifferentDeparture(lastLeg)) {
        issueCount++;
        // hasDelays === true
    }

    return issueCount;
};

export const getClassForTrain = (line) => {
    if (!line) 
        return 'no-background';
    const trainType = line.productName || '';
    const trainName = line.name || '';

    if (trainName.includes('BusSV')) {
        return 'yellow-background';
    }

    if ([
        'IC',
        'EC',
        'ICE',
        'RJ',
        'RJX',
        'D',
        'FR',
        'TGV'
    ].includes(trainType)) {
        return 'red-background';
    } else if ([
        'RE',
        'REX',
        'R',
        'RB',
        'BRB',
        'S',
        'CJX'
    ].includes(trainType)) {
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

export const formatChangeDuration = (arrivalTime, departureTime) => {
    const arrivalDate = new Date(arrivalTime);
    const departureDate = new Date(departureTime);
    const differenceInMillis = departureDate - arrivalDate;
    const differenceInMinutes = Math.round(differenceInMillis / (1000 * 60));
    const hours = Math.floor(differenceInMinutes / 60);
    const minutes = differenceInMinutes % 60;
    return `${hours}h ${minutes}min`;
};

export const formatChangeInfo = (prevLeg, nextLeg) => {
    const arrivalPlatform = prevLeg.departurePlatform || '--';
    const departurePlatform = nextLeg.departurePlatform || '--';
    const arrivalTime = formatTime(prevLeg.arrival);
    const departureTime = formatTime(nextLeg.departure);
    const changeDuration = calculateChangeTime(prevLeg.arrival, nextLeg.departure);

    return (
        <div>
            <div>{`Change from ${arrivalPlatform} to ${departurePlatform} (${arrivalTime} - ${departureTime})`}</div>
            <div>{`Change Duration: ${formatChangeDuration(prevLeg.arrival, nextLeg.departure)}`}</div>
            {
                calculateChangeTimeInMinutes(prevLeg.arrival, nextLeg.departure) > 60 && (
                    <div className="warning">
                        <FontAwesomeIcon icon={faExclamationTriangle}/>
                        Long Change Time
                    </div>
                )
            }
        </div>
    );
};

export const isDifferentArrival = (leg) => {
    return leg.plannedArrival !== leg.arrival;
}

export const isDifferentDeparture = (leg) => {
    return leg.plannedDeparture !== leg.departure;
}
