import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock, faCog, faChevronDown, faChevronUp, faTrain } from '@fortawesome/free-solid-svg-icons';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import TrainDetails from './components/TrainDetails';
import { fetchJourneys, fetchSuggestions, getSuggestionValue, renderSuggestion, getClassForTrain, calculateTotalTravelTime, countIssues, formatTime } from './components/GetTrainData';

const Stack = createStackNavigator();

const Test = ({ navigation }) => {
    const [fromQuery, setFromQuery] = useState('');
    const [toQuery, setToQuery] = useState('');
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [fromId, setFromId] = useState(null);
    const [toId, setToId] = useState(null);
    const [journeys, setJourneys] = useState([]);
    const [expandedTrain, setExpandedTrain] = useState(null);
    const [travelTime, setTravelTime] = useState('');
    const [optionsExpanded, setOptionsExpanded] = useState(false);
    const [changeTime, setChangeTime] = useState(0);
    const [maxChanges, setMaxChanges] = useState(0);
    const [maxResults, setMaxResults] = useState(0);
    const [excludedTrains, setExcludedTrains] = useState([]);

    useEffect(() => {
        if (fromId && toId) {
            fetchJourneys(
                fromId,
                toId,
                travelTime,
                setJourneys,
                changeTime,
                maxChanges,
                maxResults,
                excludedTrains
            );
        }
    }, [fromId, toId, travelTime, changeTime, maxChanges, excludedTrains]);

    const handleSuggestionsFetchRequested = async (value, setSuggestions) => {
        const suggestions = await fetchSuggestions(value);
        setSuggestions(suggestions.map(item => ({ id: item.id, title: item.name })));
    };

    const handleSearch = () => {
        if (fromId && toId) {
            fetchJourneys(
                fromId,
                toId,
                travelTime,
                setJourneys,
                changeTime,
                maxChanges,
                excludedTrains
            );
        }
    };

    const toggleDetails = (index) => {
        setExpandedTrain(expandedTrain === index ? null : index);
    };

    const handleTravelTimeChange = (text) => {
        setTravelTime(text);
    };

    const handleOptionChange = (setter) => (text) => {
        setter(Number(text));
    };

    const handleCheckboxChange = (train) => {
        setExcludedTrains(prevExcludedTrains => prevExcludedTrains.includes(train)
            ? prevExcludedTrains.filter(item => item !== train)
            : [...prevExcludedTrains, train]);
    };

    const redirectToTripDetails = (leg) => {
        const tripId = getTripDetails(leg);
        if (tripId !== '--') {
            const encodedTripId = tripId.replace(/#/g, '%23');
            navigation.navigate('TrainDetails', { tripId: encodedTripId });
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.navbar}>
                <Text style={styles.navTitle}>OnTrack</Text>
                <View style={styles.navButtons}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.navButton}>Rail Planner</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('TrainSearch')}>
                        <Text style={styles.navButton}>Search Trains</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.mainContent}>
                <Text style={styles.title}>OnTrack - Rail Planner</Text>
                <View style={styles.inputGroup}>
                    <AutocompleteDropdown
                        dataSet={fromSuggestions}
                        onChangeText={(text) => handleSuggestionsFetchRequested(text, setFromSuggestions)}
                        onSelectItem={(item) => item && setFromId(item.id)}
                        inputProps={{
                            placeholder: 'From...',
                            value: fromQuery,
                            onChangeText: setFromQuery
                        }}
                        style={styles.searchInput}
                    />
                    <AutocompleteDropdown
                        dataSet={toSuggestions}
                        onChangeText={(text) => handleSuggestionsFetchRequested(text, setToSuggestions)}
                        onSelectItem={(item) => item && setToId(item.id)}
                        inputProps={{
                            placeholder: 'To...',
                            value: toQuery,
                            onChangeText: setToQuery
                        }}
                        style={styles.searchInput}
                    />
                    <TextInput
                        placeholder="Travel Time"
                        value={travelTime}
                        onChangeText={handleTravelTimeChange}
                        keyboardType="numeric"
                        style={styles.travelTimeInput}
                    />
                    <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                        <Text>Search</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setOptionsExpanded(!optionsExpanded)} style={styles.optionsButton}>
                        <FontAwesomeIcon icon={faCog} />
                        <Text>Options</Text>
                    </TouchableOpacity>
                </View>

                {optionsExpanded && (
                    <View style={styles.options}>
                        <View style={styles.optionItem}>
                            <Text>Minimum Change Time (minutes):</Text>
                            <TextInput
                                value={changeTime.toString()}
                                onChangeText={handleOptionChange(setChangeTime)}
                                keyboardType="numeric"
                                style={styles.optionInput}
                            />
                        </View>
                        <View style={styles.optionItem}>
                            <Text>Maximum Changes:</Text>
                            <TextInput
                                value={maxChanges.toString()}
                                onChangeText={handleOptionChange(setMaxChanges)}
                                keyboardType="numeric"
                                style={styles.optionInput}
                            />
                        </View>
                        <View style={styles.optionItem}>
                            <Text>Results:</Text>
                            <TextInput
                                value={maxResults.toString()}
                                onChangeText={handleOptionChange(setMaxResults)}
                                keyboardType="numeric"
                                style={styles.optionInput}
                            />
                        </View>
                        <View style={styles.optionItem}>
                            <Text>Exclude Trains:</Text>
                            <View style={styles.checkboxGroup}>
                                {['ICE', 'IC', 'RE', 'RB', 'S-Bahn'].map((train) => (
                                    <View key={train} style={styles.checkboxItem}>
                                        <TouchableOpacity
                                            onPress={() => handleCheckboxChange(train)}
                                            style={styles.checkbox}
                                        >
                                            <Text style={styles.checkboxText}>{train}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                )}

                {journeys.length === 0 ? (
                    <Text>No journeys were found</Text>
                ) : (
                    <View style={styles.trainList}>
                        {journeys.map((journey, index) => {
                            const trainLegs = journey.legs.filter(leg => !leg.walking);

                            return (
                                <View key={index} style={styles.trainItem}>
                                    <View style={styles.trainSummary}>
                                        {trainLegs.map((leg, legIndex) => (
                                            <View key={legIndex} style={styles.trainLine}>
                                                <FontAwesomeIcon icon={faTrain} />
                                                <Text>{leg.line ? leg.line.name : 'Unknown Train'}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    <View style={styles.trainSummary}>
                                        <Text>Departure: {formatTime(journey.departure)}</Text>
                                        <Text>Arrival: {formatTime(journey.arrival)}</Text>
                                        <Text>Duration: {calculateTotalTravelTime(journey)}</Text>
                                        <Text>Issues: {countIssues(journey)}</Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => toggleDetails(index)}
                                        style={styles.detailsButton}
                                    >
                                        <FontAwesomeIcon icon={expandedTrain === index ? faChevronUp : faChevronDown} />
                                        <Text>Details</Text>
                                    </TouchableOpacity>

                                    {expandedTrain === index && (
                                        <View style={styles.trainDetails}>
                                            {trainLegs.map((leg, legIndex) => (
                                                <View key={legIndex} style={styles.legDetails}>
                                                    <Text>Departure: {formatTime(leg.departure)} from {leg.origin.name}</Text>
                                                    <Text>Arrival: {formatTime(leg.arrival)} at {leg.destination.name}</Text>
                                                    <Text>Train: {leg.line ? leg.line.name : 'Unknown Train'}</Text>
                                                    <TouchableOpacity onPress={() => redirectToTripDetails(leg)}>
                                                        <Text>View Trip Details</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const App = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Test} options={{ title: 'Rail Planner' }} />
            <Stack.Screen name="TrainSearch" component={Test} options={{ title: 'Search Trains' }} />
            <Stack.Screen name="TrainDetails" component={TrainDetails} options={{ title: 'Train Details' }} />
        </Stack.Navigator>
    </NavigationContainer>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navbar: {
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    navTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    navButtons: {
        flexDirection: 'row',
        marginTop: 10,
    },
    navButton: {
        marginRight: 15,
        fontSize: 16,
        color: '#007bff',
    },
    mainContent: {
        padding: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputGroup: {
        marginBottom: 15,
    },
    searchInput: {
        marginBottom: 10,
    },
    travelTimeInput: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    searchButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    optionsButton: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    options: {
        marginTop: 15,
    },
    optionItem: {
        marginBottom: 10,
    },
    optionInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    checkboxGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    checkbox: {
        marginRight: 5,
    },
    checkboxText: {
        fontSize: 16,
    },
    trainList: {
        marginTop: 15,
    },
    trainItem: {
        marginBottom: 20,
    },
    trainSummary: {
        marginBottom: 10,
    },
    trainLine: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    trainDetails: {
        marginTop: 10,
    },
    legDetails: {
        marginBottom: 10,
    },
});

export default App;
