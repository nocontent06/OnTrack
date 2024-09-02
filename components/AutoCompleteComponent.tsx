// AutoCompleteComponent.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { Suggestion } from './types'; // Import Suggestion type

interface AutoCompleteComponentProps {
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    suggestions: Suggestion[];
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;
    setId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AutoCompleteComponent: React.FC<AutoCompleteComponentProps> = ({
    query,
    setQuery,
    suggestions,
    setSuggestions,
    setId,
}) => {
    // Event handler for selecting a suggestion
    const onSuggestionSelected = (item: Suggestion) => {
        setQuery(item.name);
        setId(item.id);
        setSuggestions([]);
    };

    return (
        <View style={styles.container}>
            <Autocomplete
                data={suggestions}
                value={query}
                onChangeText={(text) => setQuery(text)}
                containerStyle={styles.autocompleteContainer}
                inputContainerStyle={styles.inputContainer}
                flatListProps={{
                    renderItem: ({ item }: { item: Suggestion }) => (
                        <TouchableOpacity
                            onPress={() => onSuggestionSelected(item)}
                            style={styles.suggestion}
                        >
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    ),
                    keyExtractor: (item) => item.id,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    autocompleteContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 10,
    },
    inputContainer: {
        borderWidth: 0, // Hide the default border
    },
    suggestion: {
        padding: 10,
    },
});

export default AutoCompleteComponent;
