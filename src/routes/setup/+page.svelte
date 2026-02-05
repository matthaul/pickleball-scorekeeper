<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { page } from '$app/stores';
    import { getGameMode, type GameMode } from '$lib/models/gameMode';
    import { saveGameState, saveCustomMode, loadCustomMode, loadGameState } from '$lib/stores/gameState';
    import { toolbarStore } from '$lib/stores/toolbarStore';

    let selectedMode: GameMode | null | undefined = null;
    let maxScore = 11;
    let winningMargin = 2;
    let teamRotationInterval = 0;

    // Are we editing an existing game or starting a new one?
    let isEditMode = false;

    onMount(() => {
        // Check if we're editing an existing game (?edit=true)
        isEditMode = $page.url.searchParams.get('edit') === 'true';

        if (isEditMode) {
            // Load current game settings
            const state = loadGameState();
            if (state) {
                selectedMode = getGameMode(state.mode);
                maxScore = state.maxScore;
                winningMargin = state.winningMargin;
                teamRotationInterval = state.teamRotationInterval;
            } else {
                // No game in progress - redirect to home
                goto(base || '/');
                return;
            }
        } else {
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
        }

        // Set up toolbar based on mode
        toolbarStore.setLeftButton({
            label: isEditMode ? 'Save' : 'Start Game',
            action: isEditMode ? saveSettings : startGame
        });
        toolbarStore.setCancelButton({
            label: 'Cancel',
            action: cancel
        });
        toolbarStore.setMenuItems([
            { label: 'Pick a New Game', action: goHome }
        ]);
    });

    onDestroy(() => {
        toolbarStore.reset();
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

    function saveSettings() {
        // Update existing game state with new settings
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
        // Go back to game if editing, otherwise go home
        if (isEditMode) {
            goto(`${base}/game`);
        } else {
            goto(base || '/');
        }
    }

    function goHome() {
        goto(base || '/');
    }
</script>
<div class="setup-container">
    <div class="card">
        <h1>{selectedMode?.name || 'Game'}</h1>
        {#if !isEditMode}
            <p class="description">{selectedMode?.description || ''}</p>
        {/if}

        <form on:submit|preventDefault={isEditMode ? saveSettings : startGame}>
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
        </form>
    </div>
</div>

<style>
    :global(body) {
        overflow: hidden;
        height: 100vh;
    }

    .setup-container {
        height: calc(100vh - 100px);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 0.75rem;
    }

    .card h1 {
        color: var(--primary);
        margin: 0 0 0.5rem 0;
        text-align: center;
    }

    .setting {
        margin-bottom: 0.55rem;
    }
</style>
