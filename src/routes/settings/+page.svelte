<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { loadGameState, saveGameState } from '$lib/stores/gameState';
    import { toolbarStore } from '$lib/stores/toolbarStore';

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

        // Set up toolbar
        toolbarStore.setMenuItems([
            { label: 'Save & Return', action: saveSettings },
            { label: 'Cancel', action: cancel }
        ]);
    });

    onDestroy(() => {
        toolbarStore.reset();
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
    <div class="card">
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
        </form>
    </div>
</div>

<style>
    .settings-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 1rem;
        overscroll-behavior: none;
        touch-action: pan-y;
    }

    h1 {
        color: var(--primary);
        margin: 0 0 0.5rem 0;
        text-align: center;
    }
</style>
