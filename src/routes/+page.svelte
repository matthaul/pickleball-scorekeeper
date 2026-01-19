<script>
    import { resolve } from '$app/paths';
    import { onMount } from 'svelte';

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

    onMount(() => {
        // Load initial scores when page loads
        const saved1 = localStorage.getItem('team1Score');
        const saved2 = localStorage.getItem('team2Score');
        const savedMax = localStorage.getItem('maxScore');
        const savedMargin = localStorage.getItem('winningMargin');
        const savedRotation = localStorage.getItem('teamRotationInterval');


        if (saved1) team1Score = parseInt(saved1);
        if (saved2) team2Score = parseInt(saved2);
        if (savedMax) maxScore = parseInt(savedMax);
        if (savedMargin) winningMargin = parseInt(savedMargin);
        if (savedRotation) teamRotationInterval = parseInt(savedRotation);
    });

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
        localStorage.setItem('team1Score', team1Score.toString());
        checkWin();
        checkRotate();
    }

    function addTeam2() {
        prevTeam1Score = team1Score;
        prevTeam2Score = team2Score;
        team2Score += 1;
        localStorage.setItem('team2Score', team2Score.toString());
        checkWin();
        checkRotate();
    }

    function resetScores() {
        team1Score = 0;
        team2Score = 0;
        gameWon = false;
        rotateTeams = false;
        winner = '';
        localStorage.setItem('team1Score', '0');
        localStorage.setItem('team2Score', '0');
    }

    function undo() {
        team1Score = prevTeam1Score;
        team2Score = prevTeam2Score;
        gameWon = false;
        winner = '';
        localStorage.setItem('team1Score', team1Score.toString());
        localStorage.setItem('team2Score', team2Score.toString());
    }
</script>

<div class="container">
    <div class="header" >
        {#if gameWon}
        <div class="winner-banner">
            <h1>{winner} Wins!</h1>
            <button class="win-btn" on:click={resetScores}>Start New Game</button>
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
    <button class="menu-btn" on:click={() => showMenu = !showMenu}>☰</button>
</div>

{#if showMenu}
    <div class="menu">
        <a href="settings">Settings</a>
        <button on:click={resetScores}>Reset Scores</button>
        <button on:click={() => showMenu = false}>Close</button>
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
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: none;
    pointer-events: none;

}
:global(html),
:global(body) {
    background-color: var(--bg);
    color: var(--text);
    height: 100%;
    overflow: hidden;
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
.winner-banner button {
    padding: 1rem 2rem;
    font-size: 1.5rem;
    margin-top: 1rem;
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
    border-radius: 8px;
}
.winner-banner {
    text-align: center;
    padding: 2rem;
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

