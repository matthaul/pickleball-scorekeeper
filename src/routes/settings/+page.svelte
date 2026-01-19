<script>
    import { resolve } from '$app/paths';
    import { onMount } from 'svelte';

    let maxScore = 25;
    let winningMargin = 1;
    let teamRotationInterval = 4;

    onMount(() => {
        const savedMax = localStorage.getItem('maxScore');
        const savedMargin = localStorage.getItem('winningMargin');
        const savedRotation = localStorage.getItem('teamRotationInterval');

        if (savedMax) maxScore = parseInt(savedMax);
        if (savedMargin) winningMargin = parseInt(savedMargin);
        if (savedRotation) teamRotationInterval = parseInt(savedRotation);
    });
    function saveSettings() {
        localStorage.setItem('maxScore', maxScore.toString());
        localStorage.setItem('winningMargin', winningMargin.toString());
        localStorage.setItem('teamRotationInterval', teamRotationInterval.toString());
        alert('Settings saved!');
    }
</script>

<div class="settings-container">
    <h1>Settings</h1>
    <h2>Score Settings</h2>
    <div class="setting">
        <label for="maxScore">Max Score:</label>
        <input type="number" id="maxScore" bind:value={maxScore} min="1" />
    </div>
    <div class="setting">
        <label for="winningMargin">Winning Margin:</label>
        <input type="number" id="winningMargin" bind:value={winningMargin} min="1" />
    </div>
    <h2>Team Rotation</h2>
    <div class="setting">
        <label for="teamRotationInterval">Team Rotation Interval (points):</label>
        <input type="number" id="teamRotationInterval" bind:value={teamRotationInterval} min="0" />
    <button on:click={saveSettings}>Save Settings</button>
    </div> 
    
</div>
<a href=".">Back to Game</a>

<style>
    .settings-container {
        max-width: 300px;
        margin: 2rem auto;
        padding: 2rem;
        border: 1px solid #ccc;
    }

    .setting {
        margin-bottom: 1rem;
        border: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
    }

    input {
        width: auto;
        padding: 0.5rem;
        box-sizing: border-box;
    }

    button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
    }

    a {
        display: block;
        margin-top: 1rem;
        text-align: center;
        text-decoration: none;
    }
    </style>
