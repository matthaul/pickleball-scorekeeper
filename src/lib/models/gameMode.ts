// TypeScript Interface for Game Mode
// VB.NET equivalent: Public Class GameMode with properties
export interface GameMode {
    id: string;                    // Unique identifier
    name: string;                  // Display name
    maxScore: number;              // Points to win
    winningMargin: number;         // Points ahead needed
    teamRotationInterval: number;  // 0 = no rotation
    description: string;           // Short description for card
}

// Preset game modes
// VB.NET equivalent: Shared ReadOnly List(Of GameMode)
export const GAME_MODES: GameMode[] = [
    {
        id: 'standard',
        name: 'Standard',
        maxScore: 11,
        winningMargin: 2,
        teamRotationInterval: 0,
        description: 'Traditional 11-point game'
    },
    {
        id: 'rally15',
        name: 'Rally 15',
        maxScore: 15,
        winningMargin: 2,
        teamRotationInterval: 0,
        description: '15-point rally scoring'
    },
    {
        id: 'rally21',
        name: 'Rally 21',
        maxScore: 21,
        winningMargin: 2,
        teamRotationInterval: 4,
        description: '21-point with team rotation'
    },
    {
        id: 'rally25',
        name: 'Rally 25',
        maxScore: 25,
        winningMargin: 2,
        teamRotationInterval: 4,
        description: '25-point with team rotation'
    },
    {
        id: 'quick',
        name: 'Quick Game',
        maxScore: 7,
        winningMargin: 1,
        teamRotationInterval: 0,
        description: 'Fast 7-point game'
    },
    {
        id: 'custom',
        name: 'Custom',
        maxScore: 11,  // Default starting values
        winningMargin: 2,
        teamRotationInterval: 0,
        description: 'Create your own game rules'
    }
];

// Helper function to get mode by ID
// VB.NET equivalent: Function GetGameMode(id As String) As GameMode
export function getGameMode(id: string): GameMode | undefined {
    return GAME_MODES.find(m => m.id === id);
}
