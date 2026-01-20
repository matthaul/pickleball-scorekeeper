<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { GAME_MODES } from '$lib/models/gameMode';
    import { hasGameInProgress } from '$lib/stores/gameState';

    let gameInProgress = false;

    // Check if there's a game to resume
    onMount(() => {
        gameInProgress = hasGameInProgress();
    });

    function selectMode(modeId: string) {
        // Navigate to setup page with mode parameter
        goto(`${base}/setup?mode=${modeId}`);
    }

    function resumeGame() {
        goto(`${base}/game`);
    }
</script>

<div class="home-container">
    <div class="default-banner">
        <h1>Score Keeper</h1>
        <p>Pick a game</p>
        {#if gameInProgress}
        <button class="resume-btn" on:click={resumeGame}>
            Resume Game in Progress
        </button>
    {/if}
    </div>
    


    <div class="game-modes-grid">
        {#each GAME_MODES as mode}
            <button class="mode-card" on:click={() => selectMode(mode.id)}>
                <h2>{mode.name}</h2>
                <div class="mode-details">
                    <p>{mode.maxScore} points</p>
                    <p>Win by {mode.winningMargin}</p>
                    {#if mode.teamRotationInterval > 0}
                        <p>Rotate every {mode.teamRotationInterval}</p>
                    {/if}
                </div>
                <p class="mode-description">{mode.description}</p>
            </button>
        {/each}
    </div>
</div>

<style>
    /* CSS variables from main game (dark theme) */
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

    :global(html),
    :global(body) {
        background-color: var(--bg);
        color: var(--text);
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        height: auto !important;
        overflow: auto !important;
        min-height: 100vh;
        overscroll-behavior: none !important;
        overscroll-behavior-x: none !important;
        touch-action: pan-y !important;
    }

    .home-container {
        padding: 1rem;
        max-width: 1200px;
        margin: 0 auto;
        min-height: 100vh;
        overscroll-behavior: none;
        touch-action: pan-y;
    }
    .default-banner {
    text-align: center;
    padding: 0.5rem;
    background-color: var(--secondary);
    margin-bottom: 0.5rem;
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

    h1 {
        text-align: center;
        color: var(--text);
        margin-bottom: 0.75rem;
        font-size: 1.5rem;
        font-weight: 600;
    }

    .resume-btn {
        width: 100%;
        padding: 0rem;
        font-size: 1rem;
        background-color: var(--primary);
        color: white;
        border: none;
        border-radius: 8px;
        margin-bottom: 0rem;
        cursor: pointer;
    }

    .resume-btn:hover {
        opacity: 0.9;
    }

    .game-modes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 0.75rem;
    }

    .mode-card {
        background-color: var(--light-bg);
        border: 2px solid var(--border);
        border-radius: 8px;
        padding: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
        color: var(--text);
    }

    .mode-card:hover {
        border-color: var(--primary);
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    .mode-card h2 {
        color: var(--primary);
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
        font-weight: 600;
    }

    .mode-details {
        margin: 0.5rem 0;
        font-size: 0.8rem;
        color: var(--text);
        line-height: 1.4;
    }

    .mode-details p {
        margin: 0.1rem 0;
    }

    .mode-description {
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: #999;
        font-style: italic;
        line-height: 1.3;
    }

    /* Mobile optimization */
    @media (max-width: 480px) {
        .home-container {
            padding: 0rem;
        }
        .default-banner {
            border-radius: 0;
        }

        h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }

        .game-modes-grid {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 0.5rem;
            margin-top: 0.5rem;
        }

        .mode-card {
            padding: 0.5rem;
        }

        .mode-card h2 {
            font-size: 1.5rem;
            margin: 0 0 0.4rem 0;
        }

        .mode-details {
            font-size: 1rem;
        }

        .mode-description {
            display: none;
        }

        .resume-btn {
            padding: 0.65rem;
            font-size: 0.95rem;
            margin-bottom: 0rem;
        }
    }
</style>
