<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { loadGameState, saveGameState } from '$lib/stores/gameState';

    let maxScore = 25;
    let winningMargin = 1;
    let teamRotationInterval = 4;

    onMount(() => {
        // Load from current game state
        const state = loadGameState();
        if (state) {
            maxScore = state.maxScore;
            winningMargin = state.winningMargin;
            teamRotationInterval = state.teamRotationInterval;
        } else {
            // No game in progress - redirect to home
            goto(base || '/');
        }
    });

    function saveSettings() {
        // Update game state with new settings
        const state = loadGameState();
        if (state) {
            state.maxScore = maxScore;
            state.winningMargin = winningMargin;
            state.teamRotationInterval = teamRotationInterval;
            saveGameState(state);
        }
        
        goto(`${base}/game`);
    }

    function cancel() {
        goto(`${base}/game`);
    }
</script>

<div class="settings-container">
    <div class="settings-card">
        <h1>Game Settings</h1>
        <p class="description">Adjust settings for the current game</p>

        <form on:submit|preventDefault={saveSettings}>
            <div class="setting">
                <label for="maxScore">Points to Win:</label>
                <input 
                    type="number" 
                    id="maxScore" 
                    bind:value={maxScore} 
                    min="1" 
                    max="99"
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
                />
            </div>

            <div class="setting">
                <label for="teamRotationInterval">Rotation Interval:</label>
                <input 
                    type="number" 
                    id="teamRotationInterval" 
                    bind:value={teamRotationInterval} 
                    min="0" 
                    max="20"
                />
                <small>Set to 0 to disable rotation reminders</small>
            </div>

            <div class="button-group">
                <button type="submit" class="save-btn">Save & Return</button>
                <button type="button" class="cancel-btn" on:click={cancel}>Cancel</button>
            </div>
        </form>
    </div>
</div>

<style>
    /* Same dark theme as setup page */
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
    }

    .settings-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 1rem;
        overscroll-behavior: none;
        touch-action: pan-y;
    }

    .settings-card {
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
        margin-bottom: 2rem;
        font-style: italic;
    }

    .setting {
        margin-bottom: 1.5rem;
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

    .save-btn {
        background-color: var(--primary);
        color: white;
    }

    .save-btn:hover {
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
