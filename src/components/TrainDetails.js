import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../Test/Test.css'; // Assuming you have a CSS file for styling
import API_BASE_URL from './API_BASE_URL.js';

export const TrainDetails = () => {
    const [tripDetails, setTripDetails] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tripId = queryParams.get('tripId');

    useEffect(() => {
        if (tripId) {
            // Replace '#' with '%23' in the tripId if necessary
            const encodedTripId = tripId.replace(/#/g, '%23');
            fetchTripDetails(encodedTripId);
            console.log('Encoded trip ID:', encodedTripId);
        }
    }, [tripId]);

    const fetchTripDetails = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/trips/${id}&stopovers=true`);
            const data = await response.json();
            console.log('Fetched trip details:', data); // Log the structure
            setTripDetails(data);
        } catch (error) {
            console.error('Error fetching trip details:', error);
        }
    };

    if (!tripDetails) {
        // try catching the error
        try {
            fetchTripDetails(tripId);
        } catch (error) {
            // Create a div displaying the error:
            return (
                <div className="loading-container">
                    <p>Error: {error.message}</p>
                </div>
            )
        }
        return (
            <div className="loading-container">
                <p>Loading...</p>
            </div>
        );
    }

    const {
        trip: {
            plannedDeparture = 'Not available',
            departureDelay = 'Not available',
            arrival = 'Not available',
            plannedArrival = 'Not available',
            arrivalDelay = 'Not available',
            line: {
                name = 'Not available',
                fahrtNr = 'Not available',
                operator: { name: operatorName = 'Not available' } = {},
                mode = 'Not available'
            } = {},
            direction = 'Not available',
            currentLocation: {
                latitude = 'Not available',
                longitude = 'Not available'
            } = {},
            arrivalPlatform = 'Not available',
            plannedArrivalPlatform = 'Not available',
            departurePlatform = 'Not available',
            plannedDeparturePlatform = 'Not available',
            stopovers = []
        } = {}
    } = tripDetails;

    // convert departure and arrival delay in minutes

    return (
        <div className="app">
            <div className="train-details-container">
            <h1>Train Details</h1>
            <section className="train-info">
                <h2>Train Information</h2>
                <p><strong>Line:</strong> {name} ({fahrtNr})</p>
                <p><strong>Operator:</strong> {operatorName}</p>
                <p><strong>Mode:</strong> {mode}</p>
                <p><strong>Direction:</strong> {direction}</p>
            </section>

            <section className="schedule-info">
                <h2>Schedule</h2>
                <p><strong>Departure:</strong> {new Date(plannedDeparture).toLocaleString()}</p>
                <p><strong>Departure Delay:</strong> {departureDelay / 60} minutes</p>
                <p><strong>Arrival:</strong> {new Date(arrival).toLocaleString()}</p>
                <p><strong>Planned Arrival:</strong> {new Date(plannedArrival).toLocaleString()}</p>
                <p><strong>Arrival Delay:</strong> {arrivalDelay / 60} minutes</p>
            </section>

            <section className="platform-info">
                <h2>Platforms</h2>
                <p><strong>Departure Platform:</strong> {departurePlatform}</p>
                <p><strong>Planned Departure Platform:</strong> {plannedDeparturePlatform}</p>
                <p><strong>Arrival Platform:</strong> {arrivalPlatform}</p>
                <p><strong>Planned Arrival Platform:</strong> {plannedArrivalPlatform}</p>
            </section>

            <section className="current-location">
                <h2>Current Location</h2>
                <p><strong>Latitude:</strong> {latitude}</p>
                <p><strong>Longitude:</strong> {longitude}</p>
            </section>

            <section className="stopovers">
                <h2>Stopovers</h2>
                <ul>
                    {stopovers.map((stopover, index) => (
                        <li key={index} className="stopover-item">
                            <h3>{stopover.stop?.name || 'Unknown stop'}</h3>
                            <p><strong>Arrival:</strong> {stopover.arrival ? new Date(stopover.arrival).toLocaleString() : 'Not available'}</p>
                            <p><strong>Planned Arrival:</strong> {stopover.plannedArrival ? new Date(stopover.plannedArrival).toLocaleString() : 'Not available'}</p>
                            <p><strong>Departure:</strong> {stopover.departure ? new Date(stopover.departure).toLocaleString() : 'Not available'}</p>
                            <p><strong>Planned Departure:</strong> {stopover.plannedDeparture ? new Date(stopover.plannedDeparture).toLocaleString() : 'Not available'}</p>
                            <p><strong>Arrival Platform:</strong> {stopover.arrivalPlatform || 'Not available'}</p>
                            <p><strong>Departure Platform:</strong> {stopover.departurePlatform || 'Not available'}</p>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
        </div>
    );
};

export default TrainDetails;
