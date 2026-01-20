<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { loadGameState, saveGameState, clearGameState } from '$lib/stores/gameState';

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
    let showMenu = false;
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
        <div class="winner-banner">
            <h1>{winner} Wins!</h1>
            <div class="post-game-buttons">
                
                <button class="win-btn" on:click={exitGame}>Pick a Game</button>
                <button class="win-btn" on:click={startOver}>Start Over</button>
            </div>
        </div>
        {:else if rotateTeams}
        <div class="rotate-banner">
            <h1>Rotate Teams!</h1>
            <button class="rotate-btn" on:click={() => rotateTeams = !rotateTeams}>Confirm</button>
        </div>
        {:else}
        <div class="default-banner">
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
        <button class="score-btn" on:click={addTeam1}>+1</button>
        {/if}
    </div>

    <div class ="team">
        <h1>Team 2</h1>
        <p class="score">{team2Score}</p>
        {#if !gameWon && !rotateTeams}
            <button class="score-btn" on:click={addTeam2}>+1</button>
        {/if}
    </div>
</div>
<div class="footer">
    <button class="undo-btn" on:click={undo}>Undo</button>
    <button class="menu-btn" on:click={() => showMenu = !showMenu}>{showMenu ? '✕' : '☰'}</button>
</div>

{#if showMenu}
    <div class="menu">
        
        <button on:click={returnHome}>Pick a New Game</button>
        <a href="{base}/settings">Current Game Settings</a>
        <button on:click={resetScores}>Reset Scores</button>
    </div>
{/if}
<style>
 :root {
    --footer-height: 80px;
    --primary: #5ba68c;
    --primary-dark: #4a8a72;
    --secondary: #7d6fa5;
    --dark: #2a2a2a;
    --dark-border: #404040;
    --light-bg: #3a3a3a;
    --border: #454545;
    --font-family: Arial, sans-serif;
    --text: #e0e0e0;
    --bg: #2f2f2f;
    font-family: var(--font-family);
    user-select: none;
    -webkit-user-select: none;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
:global(html),
:global(body) {
    background-color: var(--bg);
    color: var(--text);
    height: 100%;
}

button {
    border: none;
    cursor: pointer;
    border-radius: 4px;
    padding: 1rem 2rem;
    font-size: 1.5rem;
    background-color: var(--primary);
    color: white;
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

.winner-banner button {
    padding: 1rem 1rem;
    font-size: 1.25rem;
    color: white;
    background-color: var(--secondary);
}
.rotate-banner button {
    padding: 1rem 2rem;
    font-size: 1.5rem;
    margin-top: 1rem;
    color: white;
    background-color: var(--primary);
}

.container {
    display: flex;
    flex-direction: column;
    height: calc(100dvh - var(--footer-height));
    padding-bottom: var(--footer-height);
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
    background-color: var(--light-bg);
    border-bottom: 2px solid var(--border);
}

.score {
    font-size: 5rem;
    font-weight: bold;
    margin: 0.5rem 0;
    color: var(--text);
}

.score-btn {
    padding: 1rem 2rem;
    font-size: 1.5rem;
    background-color: var(--primary);
    color: white;
}

.score-btn:active {
    background-color: var(--primary-dark);
}

.default-banner {
    text-align: center;
    padding: 0.5rem;
    background-color: var(--secondary);
    color: white;
    border-radius: 0px;
}
.winner-banner {
    text-align: center;
    padding: 1rem;
    background-color: #4caf50;
    color: white;
    border-radius: 8px;
}
.rotate-banner {
    text-align: center;
    padding: 1rem;
    background-color: var(--secondary);
    color: white;
    border-radius: 8px;
}

.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: var(--dark);
    border-top: 1px solid var(--border);
}

.footer button {
    background-color: var(--secondary);
    color: white;
    padding: 0.5rem 1rem;
    font-size: 1.5rem;
}

.undo-btn {
    flex: 1;
}

.menu-btn {
    flex-shrink: 0;
}

.menu {
    position: fixed;
    bottom: var(--footer-height);
    left: 0;
    right: 0;
    background-color: var(--dark);
    display: flex;
    flex-direction: column;
    z-index: 100;
}

.menu a,
.menu button {
    padding: 1rem;
    background-color: var(--dark);
    color: white;
    text-decoration: none;
    text-align: left;
    border-bottom: 1px solid var(--dark-border);
    font-size: 1rem;
    font-family: var(--font-family);
    display: block;
}

.menu a:hover,
.menu button:hover {
    background-color: var(--dark-border);
}
</style>

