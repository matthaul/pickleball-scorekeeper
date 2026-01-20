import type { GameMode } from '../models/gameMode';

// Interface for the complete game state
// VB.NET equivalent: Public Class GameState with properties
export interface GameState {
    mode: string;                  // Game mode ID
    maxScore: number;
    winningMargin: number;
    teamRotationInterval: number;
    team1Score: number;
    team2Score: number;
    prevTeam1Score: number;        // For undo
    prevTeam2Score: number;        // For undo
}

const STORAGE_KEY = 'currentGame';
const CUSTOM_MODE_KEY = 'lastCustomMode';

// Load game state from localStorage
// VB.NET equivalent: Function LoadGameState() As GameState
export function loadGameState(): GameState | null {
    if (typeof window === 'undefined') return null; // SSR safety
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    try {
        return JSON.parse(saved);
    } catch {
        return null;
    }
}

// Save game state to localStorage
// VB.NET equivalent: Sub SaveGameState(state As GameState)
export function saveGameState(state: GameState): void {
    if (typeof window === 'undefined') return; // SSR safety
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Clear game state (new game)
// VB.NET equivalent: Sub ClearGameState()
export function clearGameState(): void {
    if (typeof window === 'undefined') return; // SSR safety
    localStorage.removeItem(STORAGE_KEY);
}

// Save last custom mode settings
// VB.NET equivalent: Sub SaveCustomMode(mode As GameMode)
export function saveCustomMode(mode: GameMode): void {
    if (typeof window === 'undefined') return; // SSR safety
    localStorage.setItem(CUSTOM_MODE_KEY, JSON.stringify(mode));
}

// Load last custom mode settings
// VB.NET equivalent: Function LoadCustomMode() As GameMode
export function loadCustomMode(): GameMode | null {
    if (typeof window === 'undefined') return null; // SSR safety
    
    const saved = localStorage.getItem(CUSTOM_MODE_KEY);
    if (!saved) return null;
    
    try {
        return JSON.parse(saved);
    } catch {
        return null;
    }
}

// Check if there's a game in progress
// VB.NET equivalent: Function HasGameInProgress() As Boolean
export function hasGameInProgress(): boolean {
    const state = loadGameState();
    if (!state) return false;
    return state.team1Score > 0 || state.team2Score > 0;
}
