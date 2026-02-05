import type { Team, Player } from '../models/team';
import { generateId } from '../models/team';

const STORAGE_KEY = 'teams';

// Load all teams from localStorage
export function loadTeams(): Team[] {
    if (typeof window === 'undefined') return [];

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
}

// Save all teams to localStorage
export function saveTeams(teams: Team[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
}

// Get a single team by ID
export function getTeam(id: string): Team | null {
    const teams = loadTeams();
    return teams.find(t => t.id === id) || null;
}

// Create a new team
export function createTeam(name: string): Team {
    const teams = loadTeams();

    const newTeam: Team = {
        id: generateId(),
        name: name.trim(),
        players: []
    };

    teams.push(newTeam);
    saveTeams(teams);
    return newTeam;
}

// Update a team
export function updateTeam(team: Team): void {
    const teams = loadTeams();
    const index = teams.findIndex(t => t.id === team.id);
    if (index !== -1) {
        teams[index] = team;
        saveTeams(teams);
    }
}

// Delete a team
export function deleteTeam(id: string): void {
    const teams = loadTeams();
    const filtered = teams.filter(t => t.id !== id);
    saveTeams(filtered);
}

// Check if team name is unique (excluding a specific team ID for edits)
export function isTeamNameUnique(name: string, excludeId?: string): boolean {
    const teams = loadTeams();
    const normalized = name.trim().toLowerCase();
    return !teams.some(t =>
        t.name.toLowerCase() === normalized && t.id !== excludeId
    );
}

// Add a player to a team
export function addPlayer(teamId: string, player: Omit<Player, 'id' | 'rank'>): Player {
    const teams = loadTeams();
    const team = teams.find(t => t.id === teamId);

    if (!team) throw new Error('Team not found');

    const newPlayer: Player = {
        ...player,
        id: generateId(),
        rank: team.players.length + 1  // Next rank
    };

    team.players.push(newPlayer);
    saveTeams(teams);
    return newPlayer;
}

// Update a player
export function updatePlayer(teamId: string, player: Player): void {
    const teams = loadTeams();
    const team = teams.find(t => t.id === teamId);

    if (!team) return;

    const index = team.players.findIndex(p => p.id === player.id);
    if (index !== -1) {
        team.players[index] = player;
        saveTeams(teams);
    }
}

// Delete a player and reorder ranks
export function deletePlayer(teamId: string, playerId: string): void {
    const teams = loadTeams();
    const team = teams.find(t => t.id === teamId);

    if (!team) return;

    team.players = team.players.filter(p => p.id !== playerId);

    // Reorder ranks
    team.players.forEach((p, i) => {
        p.rank = i + 1;
    });

    saveTeams(teams);
}

// Move player up in rank (swap with player above)
export function movePlayerUp(teamId: string, playerId: string): void {
    const teams = loadTeams();
    const team = teams.find(t => t.id === teamId);

    if (!team) return;

    const index = team.players.findIndex(p => p.id === playerId);
    if (index <= 0) return;  // Already at top

    // Swap ranks
    const temp = team.players[index].rank;
    team.players[index].rank = team.players[index - 1].rank;
    team.players[index - 1].rank = temp;

    // Swap positions in array
    [team.players[index], team.players[index - 1]] = [team.players[index - 1], team.players[index]];

    saveTeams(teams);
}

// Move player down in rank (swap with player below)
export function movePlayerDown(teamId: string, playerId: string): void {
    const teams = loadTeams();
    const team = teams.find(t => t.id === teamId);

    if (!team) return;

    const index = team.players.findIndex(p => p.id === playerId);
    if (index === -1 || index >= team.players.length - 1) return;  // Already at bottom

    // Swap ranks
    const temp = team.players[index].rank;
    team.players[index].rank = team.players[index + 1].rank;
    team.players[index + 1].rank = temp;

    // Swap positions in array
    [team.players[index], team.players[index + 1]] = [team.players[index + 1], team.players[index]];

    saveTeams(teams);
}
