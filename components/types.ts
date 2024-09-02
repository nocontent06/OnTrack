// Define types for suggestions and journeys
export interface Suggestion {
    id: string;
    name: string;
}

export interface Journey {
    legs: Leg[];
}

export interface Leg {
    departure: string;
    arrival: string;
    departurePlatform?: string;
    arrivalPlatform?: string;
    direction: string;
    destination: { name: string };
    line?: {
        productName?: string;
        name?: string;
    };
}

export interface Suggestion {
    id: string;
    name: string;
}

// Add additional types as needed
