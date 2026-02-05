// Player belongs to exactly one team
export interface Player {
    id: string;
    firstName: string;
    lastName: string;
    gender: 'M' | 'F';
    level: number;    // Skill rating: 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0
    rank: number;     // Position on team: 1, 2, 3, etc.
}

// Team with its players
export interface Team {
    id: string;
    name: string;
    players: Player[];
}

// Valid skill levels for pickleball
export const SKILL_LEVELS = [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

// Generate a simple unique ID
export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
