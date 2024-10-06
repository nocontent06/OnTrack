import React, {useEffect, useState, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet styles
import L from 'leaflet';
import '../Test/Test.css'; // Assuming you have a CSS file for styling
import API_BASE_URL from './API_BASE_URL.js';
import { Button } from 'bootstrap';

const trainIcon = new L.Icon({
    iconUrl: require('../img/train_flat.png'), // Add the path to your train icon image here
    iconSize: [
        40, 40
    ], // Adjust size as needed
    iconAnchor: [
        20, 40
    ], // Anchor point of the icon (center it properly)
    popupAnchor: [
        0, -40
    ], // Position popup above the marker
});

const UpdateMapView = ({coords}) => {
    const map = useMap();
    useEffect(() => {
        map.setView(coords);
    }, [coords, map]);
    return null;
};



export const TrainDetails = () => {
    const [tripDetails, setTripDetails] = useState(null);
    const [position, setPosition] = useState({latitude: 0, longitude: 0});
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tripId = queryParams.get('tripId');

    const encodedTripId = tripId
        .replace(/#/g, '%23')
        .replace(/ /g, '%20');

    useEffect(() => {
        if (tripId) {
            // Encode the tripId for safe usage in URLs
            console.log('Encoded trip ID:', encodedTripId);

            // Fetch trip details using the encoded trip ID
            fetchTripDetails(encodedTripId);
        }
    }, [tripId]);

    const refreshButton = () => {
        fetchTripDetails(encodedTripId);
    }

    const fetchTripDetails = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/trips/${id}`);
            const data = await response.json();
            // console.log('Fetched trip details:', data);
            setTripDetails(data);

            // Update initial position with current location from trip details
            if (data.trip && data.trip.currentLocation) {
                setPosition(
                    {latitude: data.trip.currentLocation.latitude, longitude: data.trip.currentLocation.longitude}
                );
            }

            // Update setPosition by calling the API every 2 seconds
            // setInterval(() => {
            //     fetchTripDetails(id);
            // }, 2000);

        } catch (error) {
            console.error('Error fetching trip details:', error);
        }
    };

    if (!tripDetails) {
        return (
            <div className="loading-container">
                <p>loading...</p>
            </div>
        );
    }

    // check if arrival and plannedArrival are the same, otherwise color the arrival time in red
    const isDifferentArrival = (leg) => {
        return leg.plannedArrival !== leg.arrival;
    };

    const isDifferentDeparture = (leg) => {
        return leg.plannedDeparture !== leg.departure;
    };

    const formatDate = (dateString) => {
        const leg = tripDetails.trip
        const date = new Date(dateString);
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        if (date.toDateString() === now.toDateString()) {
            if (isDifferentArrival(leg)) {
                return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            } else if (isDifferentDeparture(leg)) {
                return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }
            return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
    };

    const formatDelayedDate = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };


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
                operator: {
                    name: operatorName = 'Not available'
                } = {},
                mode = 'Not available'
            } = {},
            direction = 'Not available',
            arrivalPlatform = 'Not available',
            plannedArrivalPlatform = 'Not available',
            departurePlatform = 'Not available',
            plannedDeparturePlatform = 'Not available',
            stopovers = []
        } = {}
    } = tripDetails;

    return (
        <div className="app">
            <div className="train-details-container">
                <h1>Train Details</h1>

                <section className="train-info">
                    <h2>Train Information</h2>
                    <p>
                        <strong>Line:</strong>
                        {name}
                        ({fahrtNr})
                    </p>
                    <p>
                        <strong>Operator:</strong>
                        {operatorName}
                    </p>
                    <p>
                        <strong>Mode:</strong>
                        {mode}
                    </p>
                    <p>
                        <strong>Direction:</strong>
                        {direction}
                    </p>
                </section>

                <section className="schedule-info">
                    <h2>Schedule</h2>
                    <p>
                        <strong>Departure: </strong>
                        {isDifferentDeparture(tripDetails.trip) ? 
                            <span style={{color: 'red'}}>
                                {formatDate(plannedDeparture).toLocaleString()} (+ {departureDelay / 60}m)
                            </span> 
                                :
                            <span style={{color: 'green'}}>
                                {formatDate(plannedDeparture).toLocaleString()}
                            </span>
                        }
                    </p>
                    <p>
                        <strong>Arrival: </strong>
                        {isDifferentArrival(tripDetails.trip) ? 
                            <span style={{color: 'red'}}>
                                {formatDate(arrival).toLocaleString()} (+ {arrivalDelay / 60}m)
                            </span> 
                            : 
                            <span style={{color: 'green'}}>
                                {formatDate(arrival).toLocaleString()}
                            </span>
                        }
                    </p>
                </section>

                <section className="platform-info">
                    <h2>Platforms</h2>
                    <p>
                        <strong>Departure Platform:</strong>
                        {departurePlatform}
                    </p>
                    <p>
                        <strong>Planned Departure Platform:</strong>
                        {plannedDeparturePlatform}
                    </p>
                    <p>
                        <strong>Arrival Platform:</strong>
                        {arrivalPlatform}
                    </p>
                    <p>
                        <strong>Planned Arrival Platform:</strong>
                        {plannedArrivalPlatform}
                    </p>
                </section>

                <section className="current-location">
                    <h2>Current Location</h2>
                    <p>
                        <strong>Latitude:</strong>
                        {position.latitude}
                    </p>
                    <p>
                        <strong>Longitude:</strong>
                        {position.longitude}
                    </p>

                    <button className="btn btn-primary" onClick={refreshButton}>Refresh</button>

                    {/* Map component */}
                    {/* Create refresh button */}
                    <MapContainer
                        center={[position.latitude, position.longitude]}
                        zoom={13}
                        style={{
                            height: "300px",
                            width: "100%"
                        }}
                        scrollWheelZoom={false}>

                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/> {/* Update map view without full re-render */}
                        <UpdateMapView coords={[position.latitude, position.longitude]}/> {/* Marker that moves with the train */}
                        <Marker position={[position.latitude, position.longitude]} icon={trainIcon}>
                            <Popup>The train is here!</Popup>
                        </Marker>
                    </MapContainer>
                </section>

                <section className="stopovers">
                    <h2>Stopovers</h2>
                    <ul>
                        {
                            stopovers.map((stopover, index) => (
                                <li key={index} className="stopover-item">
                                    <h3>{stopover.stop?.name || 'Unknown stop'}</h3>
                                        {
                                        index > 0 && (
                                        <> 
                                            <p> 
                                                <strong>Arrival:</strong>{' '} 
                                                {isDifferentArrival(tripDetails.trip) ? 
                                                    <span style={{color: 'red'}}>   
                                                    {formatDate(stopover.arrival).toLocaleString()} (+ {stopover.arrivalDelay / 60}m)
                                                    </span> 
                                                    : 
                                                    <span style={{color: 'green'}}>
                                                        {formatDate(stopover.arrival).toLocaleString()}
                                                    </span>
                                                }
                                            </p>
                                        </>)
                                        }
                                    <p>
                                        <strong>Departure:</strong>{' '}
                                        {isDifferentDeparture(tripDetails.trip) ? 
                                            <span style={{color: 'red'}}>
                                                <s>{formatDate(stopover.plannedDeparture).toLocaleString()} (+ {stopover.departureDelay / 60}m)</s>    {formatDate(stopover.departure).toLocaleString()} (+ {stopover.departureDelay / 60}m)
                                            </span> 
                                                :
                                            <span style={{color: 'green'}}>
                                                {formatDate(stopover.departure).toLocaleString()}
                                            </span>
                                        }
                                    </p>
                                    {index > 0 && <p><strong>Departure Platform:</strong>{' '} {stopover.departurePlatform}</p>}
                                    <p>
                                        <strong>Arr. / Dep. Platform: </strong>
                                        {stopover.arrivalPlatform || 'Not available'} / {stopover.departurePlatform || 'Not available'}
                                    </p>
                                </li>
                            ))
                        }
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default TrainDetails;
