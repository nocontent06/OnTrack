const API_BASE_URL = 'https://v6.db.transport.rest';

// export const fetchTrains = async (query) => {
//     try {
//         const response = await fetch(`${API_BASE_URL}/trips?query=${query}&onlyCurrentlyRunning=false`);
//         if (!response.ok) {
//             throw new Error('Network response was not ok... Status code: ' + response.status);
//         }
//         const data = await response.json();

//         // Create a map to filter out duplicate trains based on train name
//         const uniqueTrains = new Map();

//         data.trips.forEach((trip) => {
//             const trainName = trip.line.name;
//             // If the train is not already in the map, add it
//             if (!uniqueTrains.has(trainName)) {
//                 uniqueTrains.set(trainName, {
//                     name: trainName,
//                     id: trip.id,
//                     departure: trip.stopovers[0]?.plannedDeparture,
//                     arrival: trip.stopovers[trip.stopovers.length - 1]?.plannedArrival,
//                     date: trip.stopovers[0]?.plannedDeparture || 'N/A', // Add date as a field
//                     from: trip.origin.name,
//                     to: trip.destination.name,
//                 });
//             }
//         });

//         return Array.from(uniqueTrains.values());
//     } catch (error) {
//         console.error('Error fetching train data:', error);
//         throw error;
//     }
// };
