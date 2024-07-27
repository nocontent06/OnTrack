const API_BASE_URL = 'https://v6.db.transport.rest';

export const fetchTrains = async (tripId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/trips/${tripId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching train data:', error);
        throw error;
    }
};
