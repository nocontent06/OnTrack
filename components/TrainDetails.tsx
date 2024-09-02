import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const TrainDetails = () => {
    const [tripDetails, setTripDetails] = useState(null);
    const route = useRoute();
    const { tripId } = route.params;

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
            const response = await fetch(`https://v6.db.transport.rest/trips/${id}?stopovers=true`);
            const data = await response.json();
            console.log('Fetched trip details:', data); // Log the structure
            setTripDetails(data);
        } catch (error) {
            console.error('Error fetching trip details:', error);
        }
    };

    if (!tripDetails) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
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

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Train Details</Text>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Train Information</Text>
                <Text><Text style={styles.bold}>Line:</Text> {name} ({fahrtNr})</Text>
                <Text><Text style={styles.bold}>Operator:</Text> {operatorName}</Text>
                <Text><Text style={styles.bold}>Mode:</Text> {mode}</Text>
                <Text><Text style={styles.bold}>Direction:</Text> {direction}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Schedule</Text>
                <Text><Text style={styles.bold}>Departure:</Text> {new Date(plannedDeparture).toLocaleString()}</Text>
                <Text><Text style={styles.bold}>Departure Delay:</Text> {departureDelay / 60} minutes</Text>
                <Text><Text style={styles.bold}>Arrival:</Text> {new Date(arrival).toLocaleString()}</Text>
                <Text><Text style={styles.bold}>Planned Arrival:</Text> {new Date(plannedArrival).toLocaleString()}</Text>
                <Text><Text style={styles.bold}>Arrival Delay:</Text> {arrivalDelay / 60} minutes</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Platforms</Text>
                <Text><Text style={styles.bold}>Departure Platform:</Text> {departurePlatform}</Text>
                <Text><Text style={styles.bold}>Planned Departure Platform:</Text> {plannedDeparturePlatform}</Text>
                <Text><Text style={styles.bold}>Arrival Platform:</Text> {arrivalPlatform}</Text>
                <Text><Text style={styles.bold}>Planned Arrival Platform:</Text> {plannedArrivalPlatform}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Location</Text>
                <Text><Text style={styles.bold}>Latitude:</Text> {latitude}</Text>
                <Text><Text style={styles.bold}>Longitude:</Text> {longitude}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Stopovers</Text>
                {stopovers.map((stopover, index) => (
                    <View key={index} style={styles.stopoverItem}>
                        <Text style={styles.bold}>{stopover.stop?.name || 'Unknown stop'}</Text>
                        <Text><Text style={styles.bold}>Arrival:</Text> {stopover.arrival ? new Date(stopover.arrival).toLocaleString() : 'Not available'}</Text>
                        <Text><Text style={styles.bold}>Planned Arrival:</Text> {stopover.plannedArrival ? new Date(stopover.plannedArrival).toLocaleString() : 'Not available'}</Text>
                        <Text><Text style={styles.bold}>Departure:</Text> {stopover.departure ? new Date(stopover.departure).toLocaleString() : 'Not available'}</Text>
                        <Text><Text style={styles.bold}>Planned Departure:</Text> {stopover.plannedDeparture ? new Date(stopover.plannedDeparture).toLocaleString() : 'Not available'}</Text>
                        <Text><Text style={styles.bold}>Arrival Platform:</Text> {stopover.arrivalPlatform || 'Not available'}</Text>
                        <Text><Text style={styles.bold}>Departure Platform:</Text> {stopover.departurePlatform || 'Not available'}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stopoverItem: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
});

export default TrainDetails;
