<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { loadGameState, saveGameState, clearGameState } from '$lib/stores/gameState';
    import { toolbarStore } from '$lib/stores/toolbarStore';

    let team1Score = 0;
    let team2Score = 0;
    let prevTeam1Score = 0;
    let prevTeam2Score = 0;
    let maxScore = 25;
    let winningMargin = 1;
    let teamRotationInterval = 4;
    let gameWon = false;
    let rotateTeams = false;
    let winner = '';
    let currentMode = '';

    onMount(() => {
        // Load complete game state from localStorage
        const state = loadGameState();

        if (state) {
            team1Score = state.team1Score;
            team2Score = state.team2Score;
            prevTeam1Score = state.prevTeam1Score;
            prevTeam2Score = state.prevTeam2Score;
            maxScore = state.maxScore;
            winningMargin = state.winningMargin;
            teamRotationInterval = state.teamRotationInterval;
            currentMode = state.mode;
        } else {
            // No game state - redirect to home
            goto(base || '/');
        }

        // Set up toolbar
        toolbarStore.setLeftButton({
            label: 'Undo',
            action: undo
        });

        toolbarStore.setMenuItems([
            { label: 'Pick a New Game', action: returnHome },
            { label: 'Current Game Settings', href: `${base}/settings` },
            { label: 'Reset Scores', action: resetScores }
        ]);
    });

    onDestroy(() => {
        toolbarStore.reset();
    });

    // Save current state to localStorage
    function saveCurrentState() {
        const state = loadGameState();
        if (state) {
            state.team1Score = team1Score;
            state.team2Score = team2Score;
            state.prevTeam1Score = prevTeam1Score;
            state.prevTeam2Score = prevTeam2Score;
            saveGameState(state);
        }
    }

    function checkWin() {
        if (team1Score >= maxScore && team1Score - team2Score >= winningMargin) {
            gameWon = true;
            winner = 'Team 1';
        } else if (team2Score >= maxScore && team2Score - team1Score >= winningMargin) {
            gameWon = true;
            winner = 'Team 2';
        }
    }

    function checkRotate() {
        const totalScore = team1Score + team2Score;
        if (teamRotationInterval > 0 && totalScore > 0 && totalScore % teamRotationInterval === 0) {
            // Logic to rotate teams can be implemented here
            rotateTeams = true;
            console.log('Rotate teams!');
        }
    }

    function addTeam1() {
        prevTeam1Score = team1Score;
        prevTeam2Score = team2Score;
        team1Score += 1;
        saveCurrentState();
        checkWin();
        checkRotate();
    }

    function addTeam2() {
        prevTeam1Score = team1Score;
        prevTeam2Score = team2Score;
        team2Score += 1;
        saveCurrentState();
        checkWin();
        checkRotate();
    }

    function resetScores() {
        team1Score = 0;
        team2Score = 0;
        gameWon = false;
        rotateTeams = false;
        winner = '';
        saveCurrentState();
    }

    function undo() {
        team1Score = prevTeam1Score;
        team2Score = prevTeam2Score;
        gameWon = false;
        winner = '';
        rotateTeams = false;
        saveCurrentState();
    }

    // New: Start over with same settings
    function startOver() {
        resetScores();
    }

    // New: Modify game settings
    function modifyGame() {
        goto(`${base}/setup?mode=${currentMode}`);
    }

    // New: Return to home (preserves game state for resume)
    function returnHome() {
        // Don't clear game state - allows resume from home screen
        goto(base || '/');
    }

    // New: Exit game completely (clears state)
    function exitGame() {
        clearGameState();
        goto(base || '/');
    }
</script>

<div class="container">
    <div class="header" >
        {#if gameWon}
        <div class="banner banner-success">
            <h1>{winner} Wins!</h1>
            <div class="post-game-buttons">
                
                <button class="btn-win" on:click={exitGame}>Pick a Game</button>
                <button class="btn-win" on:click={startOver}>Start Over</button>
            </div>
        </div>
        {:else if rotateTeams}
        <div class="banner banner-info">
            <h1>Rotate Teams!</h1>
            <button class="btn-rotate" on:click={() => rotateTeams = !rotateTeams}>Confirm</button>
        </div>
        {:else}
        <div class="banner banner-default">
            <h1>Score Keeper</h1>
            <p>First to {maxScore} wins!</p>
            <p>Winning Margin: {winningMargin}</p>
            {#if teamRotationInterval > 0}
                <p>Team Rotation every {teamRotationInterval} points</p>
            {/if}
        </div>
        {/if}
    </div>
    <div class="team">
        <h1>Team 1</h1>
        <p class="score">{team1Score}</p>
        {#if !gameWon && !rotateTeams}
        <button class="btn-score" on:click={addTeam1}>+1</button>
        {/if}
    </div>

    <div class ="team">
        <h1>Team 2</h1>
        <p class="score">{team2Score}</p>
        {#if !gameWon && !rotateTeams}
            <button class="btn-score" on:click={addTeam2}>+1</button>
        {/if}
    </div>
</div>

<style>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
:global(html),
:global(body) {
    height: 100%;
}

button {
    border: none;
    cursor: pointer;
    border-radius: 4px;
    padding: 1rem 2rem;
    font-size: 1.5rem;
    background-color: var(--primary);
    color: var(--text);
}
button,
a,
input {
    touch-action: manipulation;
    pointer-events: all;
}

button:active {
    background-color: var(--primary-dark);
}
.post-game-buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    flex-wrap: wrap;
    justify-content: center;
}

.post-game-buttons button {
    flex: 1;
    min-width: 120px;
    padding: 0.75rem 1rem;
    font-size: 1rem;
}

.banner-success button {
    padding: 1rem 1rem;
    font-size: 1.25rem;
    color: var(--text-light);
    background-color: var(--secondary);
}

.banner-info button {
    padding: 1rem 2rem;
    font-size: 1.5rem;
    margin-top: 1rem;
    color: var(--text-light);
    background-color: var(--primary);
}

.container {
    display: flex;
    flex-direction: column;
    height: calc(100dvh - var(--toolbar-height));
    overflow: hidden;
    overscroll-behavior: none;
    touch-action: none;
}
.team {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 1rem;
    background-color: var(--bg);
    color: var(--text);
}

.team:first-of-type {
    background-color: var(--bg-light);
    border-bottom: 2px solid var(--border);
}

.score {
    font-size: 5rem;
    font-weight: bold;
    font-family: var(--font-score);
    margin: 0.5rem 0;
    color: var(--text);
}

.btn-score {
    padding: 1rem 2rem;
    font-size: 1.5rem;
    background-color: var(--primary);
    color: var(--text-light);
}

.btn-score:active {
    background-color: var(--primary-dark);
}
</style>

