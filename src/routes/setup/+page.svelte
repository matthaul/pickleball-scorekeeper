<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { page } from '$app/stores';
    import { getGameMode, type GameMode } from '$lib/models/gameMode';
    import { saveGameState, saveCustomMode, loadCustomMode } from '$lib/stores/gameState';

    let selectedMode: GameMode | null | undefined = null;
    let maxScore = 11;
    let winningMargin = 2;
    let teamRotationInterval = 0;

    onMount(() => {
        // Get mode from URL parameter (?mode=rally21)
        const modeId = $page.url.searchParams.get('mode');
        
        if (modeId === 'custom') {
            // Load last custom settings if available
            const lastCustom = loadCustomMode();
            if (lastCustom) {
                selectedMode = lastCustom;
                maxScore = lastCustom.maxScore;
                winningMargin = lastCustom.winningMargin;
                teamRotationInterval = lastCustom.teamRotationInterval;
            } else {
                // Default custom values
                selectedMode = getGameMode('custom');
                maxScore = 11;
                winningMargin = 2;
                teamRotationInterval = 0;
            }
        } else {
            // Load preset mode
            selectedMode = getGameMode(modeId || 'standard');
            if (selectedMode) {
                maxScore = selectedMode.maxScore;
                winningMargin = selectedMode.winningMargin;
                teamRotationInterval = selectedMode.teamRotationInterval;
            }
        }
    });

    function startGame() {
        // If custom mode, save these settings for next time
        if (selectedMode?.id === 'custom') {
            saveCustomMode({
                id: 'custom',
                name: 'Custom',
                maxScore,
                winningMargin,
                teamRotationInterval,
                description: 'Your custom settings'
            });
        }

        // Create initial game state
        const gameState = {
            mode: selectedMode?.id || 'standard',
            maxScore,
            winningMargin,
            teamRotationInterval,
            team1Score: 0,
            team2Score: 0,
            prevTeam1Score: 0,
            prevTeam2Score: 0
        };

        // Save to localStorage
        saveGameState(gameState);

        // Navigate to game
        goto(`${base}/game`);
    }

    function cancel() {
        goto(base || '/');
    }
</script>
<div class="default-banner">
    <h1>Score Keeper</h1>
    <p>Game Settings</p>
</div>
<div class="setup-container">
    <div class="setup-card">
        <h1>{selectedMode?.name || 'Game'}</h1>
        <p class="description">{selectedMode?.description || ''}</p>

        <form on:submit|preventDefault={startGame}>
            <div class="setting">
                <label for="maxScore">Points to Win:</label>
                <input 
                    type="number" 
                    id="maxScore" 
                    bind:value={maxScore} 
                    min="1" 
                    max="99"
                    required
                />
            </div>

            <div class="setting">
                <label for="winningMargin">Winning Margin:</label>
                <input 
                    type="number" 
                    id="winningMargin" 
                    bind:value={winningMargin} 
                    min="1" 
                    max="10"
                    required
                />
            </div>

            <div class="setting">
                <label for="rotation">Team Rotation Interval:</label>
                <input 
                    type="number" 
                    id="rotation" 
                    bind:value={teamRotationInterval} 
                    min="0" 
                    max="20"
                />
                <small>Set to 0 to disable rotation reminders</small>
            </div>

            <div class="button-group">
                <button type="submit" class="start-btn">Start Game</button>
                <button type="button" class="cancel-btn" on:click={cancel}>Cancel</button>
            </div>
        </form>
    </div>
</div>

<style>
    /* CSS variables - dark theme */
    :root {
        --primary: #5ba68c;
        --primary-dark: #4a8a72;
        --secondary: #7d6fa5;
        --dark: #2a2a2a;
        --text: #e0e0e0;
        --bg: #2f2f2f;
        --light-bg: #3a3a3a;
        --border: #454545;
    }

    :global(body) {
        background-color: var(--bg);
        color: var(--text);
        overflow: hidden;
        font-family: Arial, sans-serif;
        height: 100vh;
    }
    .default-banner {
    text-align: center;
    padding: 0.5rem;
    background-color: var(--secondary);
    margin-bottom: 0rem;
    color: white;
    border-radius: 0px;
    }
    .default-banner h1 {
        margin: 0;
        font-size: 2rem;
        color: white;
        font-weight: 700;
    }
    .default-banner p {
        margin: 0.25rem 0 0.5rem 0;
        font-size: 1.5rem;
        color: white;
    }
    .setup-container {
    height: calc(100vh - 100px); /* subtract banner height */
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 0.75rem;
    }

    .setup-card {
        background-color: var(--light-bg);
        border: 2px solid var(--border);
        border-radius: 12px;
        padding: 2rem;
        max-width: 500px;
        width: 100%;
    }

    h1 {
        color: var(--primary);
        margin: 0 0 0.5rem 0;
        text-align: center;
    }

    .description {
        text-align: center;
        color: #999;
        margin-bottom: 1rem;
        font-style: italic;
    }

    .setting {
        margin-bottom: 0.55rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text);
        font-weight: bold;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        font-size: 1.1rem;
        background-color: var(--dark);
        color: var(--text);
        border: 1px solid var(--border);
        border-radius: 4px;
        box-sizing: border-box;
    }

    input:focus {
        outline: none;
        border-color: var(--primary);
    }

    small {
        display: block;
        margin-top: 0.25rem;
        color: #999;
        font-size: 0.85rem;
    }

    .button-group {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }

    button {
        flex: 1;
        padding: 1rem;
        font-size: 1.1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s;
    }

    .start-btn {
        background-color: var(--primary);
        color: white;
    }

    .start-btn:hover {
        background-color: var(--primary-dark);
    }

    .cancel-btn {
        background-color: var(--dark);
        color: var(--text);
        border: 1px solid var(--border);
    }

    .cancel-btn:hover {
        background-color: var(--border);
    }
</style>
