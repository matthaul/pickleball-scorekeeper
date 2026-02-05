<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { page } from '$app/stores';
    import {
        getTeam,
        updateTeam,
        addPlayer,
        updatePlayer,
        deletePlayer,
        movePlayerUp,
        movePlayerDown,
        isTeamNameUnique
    } from '$lib/stores/teamState';
    import { toolbarStore } from '$lib/stores/toolbarStore';
    import { SKILL_LEVELS, type Player, type Team } from '$lib/models/team';

    let team: Team | null = null;
    let teamName = '';
    let nameError = '';

    // Player form state
    let showPlayerForm = false;
    let editingPlayer: Player | null = null;
    let playerFirstName = '';
    let playerLastName = '';
    let playerGender: 'M' | 'F' = 'M';
    let playerLevel = 3.5;

    onMount(() => {
        const id = $page.params.id;
        team = getTeam(id);

        if (!team) {
            goto(`${base}/teams`);
            return;
        }

        teamName = team.name;

        setDefaultToolbar();
    });

    onDestroy(() => {
        toolbarStore.reset();
    });

    function saveTeamName() {
        if (!team) return;
        nameError = '';

        if (!teamName.trim()) {
            nameError = 'Team name is required';
            return;
        }

        if (!isTeamNameUnique(teamName, team.id)) {
            nameError = 'Team name already exists';
            return;
        }

        team.name = teamName.trim();
        updateTeam(team);
    }

    function setDefaultToolbar() {
        toolbarStore.setLeftButton({
            label: 'Add Player',
            action: openAddPlayer
        });
        toolbarStore.setCancelButton({
            label: 'Back',
            action: () => goto(`${base}/teams`)
        });
        toolbarStore.setMenuItems([
            { label: 'All Teams', href: `${base}/teams` },
            { label: 'Home', href: `${base}/` }
        ]);
    }

    function openAddPlayer() {
        editingPlayer = null;
        playerFirstName = '';
        playerLastName = '';
        playerGender = 'M';
        playerLevel = 3.5;
        showPlayerForm = true;
        // Hide toolbar when form is open
        toolbarStore.reset();
    }

    function openEditPlayer(player: Player) {
        editingPlayer = player;
        playerFirstName = player.firstName;
        playerLastName = player.lastName;
        playerGender = player.gender;
        playerLevel = player.level;
        showPlayerForm = true;
        // Hide toolbar when form is open
        toolbarStore.reset();
    }

    function closePlayerForm() {
        showPlayerForm = false;
        editingPlayer = null;
        // Restore toolbar
        setDefaultToolbar();
    }

    function handleSavePlayer() {
        if (!team) return;

        if (editingPlayer) {
            // Update existing player
            updatePlayer(team.id, {
                ...editingPlayer,
                firstName: playerFirstName.trim(),
                lastName: playerLastName.trim(),
                gender: playerGender,
                level: playerLevel
            });
        } else {
            // Add new player
            addPlayer(team.id, {
                firstName: playerFirstName.trim(),
                lastName: playerLastName.trim(),
                gender: playerGender,
                level: playerLevel
            });
        }

        // Reload team data
        team = getTeam(team.id);
        closePlayerForm();
    }

    function handleDeletePlayer(playerId: string) {
        if (!team) return;
        deletePlayer(team.id, playerId);
        team = getTeam(team.id);
    }

    function handleMoveUp(playerId: string) {
        if (!team) return;
        movePlayerUp(team.id, playerId);
        team = getTeam(team.id);
    }

    function handleMoveDown(playerId: string) {
        if (!team) return;
        movePlayerDown(team.id, playerId);
        team = getTeam(team.id);
    }
</script>

<svelte:head>
    <style>
        html, body {
            height: auto !important;
            overflow: auto !important;
        }
    </style>
</svelte:head>

{#if team}
    <div class="banner banner-default">
        <h1>{team.name}</h1>
        <p>{team.players.length} player{team.players.length !== 1 ? 's' : ''}</p>
    </div>

    <div class="team-container">
        <!-- Team Name Edit -->
        <div class="card team-name-card">
            <div class="setting">
                <label for="teamName">Team Name:</label>
                <input
                    type="text"
                    id="teamName"
                    bind:value={teamName}
                    on:blur={saveTeamName}
                />
                {#if nameError}
                    <small class="error">{nameError}</small>
                {/if}
            </div>
        </div>

        <!-- Add/Edit Player Form -->
        {#if showPlayerForm}
            <div class="card player-form">
                <h2>{editingPlayer ? 'Edit Player' : 'Add Player'}</h2>
                <form on:submit|preventDefault={handleSavePlayer}>
                    <div class="form-row">
                        <div class="setting">
                            <label for="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                bind:value={playerFirstName}
                                required
                                autofocus
                            />
                        </div>
                        <div class="setting">
                            <label for="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                bind:value={playerLastName}
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="setting">
                            <label for="gender">Gender:</label>
                            <select id="gender" bind:value={playerGender}>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                        <div class="setting">
                            <label for="level">Skill Level:</label>
                            <select id="level" bind:value={playerLevel}>
                                {#each SKILL_LEVELS as level}
                                    <option value={level}>{level.toFixed(1)}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="button-row">
                        <button type="button" class="btn-secondary" on:click={closePlayerForm}>
                            Cancel
                        </button>
                        <button type="submit" class="btn-primary">
                            {editingPlayer ? 'Save' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        {/if}

        <!-- Players List -->
        {#if team.players.length === 0 && !showPlayerForm}
            <div class="empty-state">
                <p>No players yet</p>
                <p class="hint">Tap "Add Player" to add one</p>
            </div>
        {:else if team.players.length > 0}
            <div class="players-list">
                <h3>Players</h3>
                {#each team.players as player, index}
                    <div class="player-card">
                        <div class="player-rank">#{player.rank}</div>
                        <div class="player-info" on:click={() => openEditPlayer(player)}>
                            <div class="player-name">
                                <span class="first-name">{player.firstName}</span>{#if player.lastName} <span class="last-name">{player.lastName}</span>{/if}
                            </div>
                            <div class="player-details">
                                {player.gender === 'M' ? 'Male' : 'Female'} · {player.level.toFixed(1)}
                            </div>
                        </div>
                        <div class="player-actions">
                            <button
                                class="btn-move"
                                disabled={index === 0}
                                on:click={() => handleMoveUp(player.id)}
                            >▲</button>
                            <button
                                class="btn-move"
                                disabled={index === team.players.length - 1}
                                on:click={() => handleMoveDown(player.id)}
                            >▼</button>
                            <button
                                class="btn-delete-small"
                                on:click={() => handleDeletePlayer(player.id)}
                            >✕</button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
{/if}

<style>
    .team-container {
        padding: 1rem;
        max-width: 600px;
        margin: 0 auto;
        box-sizing: border-box;
        min-height: 100vh;
        padding-bottom: 80px;
    }

    .team-name-card {
        margin-bottom: 1rem;
    }

    .player-form {
        margin-bottom: 1rem;
    }

    .player-form h2 {
        margin: 0 0 1rem 0;
        color: var(--primary);
    }

    .form-row {
        display: flex;
        gap: 0.75rem;
    }

    .form-row .setting {
        flex: 1;
        min-width: 0;  /* Prevent flex items from overflowing */
    }

    select {
        width: 100%;
        padding: 0.75rem;
        font-size: 1.1rem;
        background-color: var(--bg-dark);
        color: var(--text);
        border: 1px solid var(--border);
        border-radius: 4px;
        appearance: none;
        -webkit-appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e6e8eb' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.75rem center;
        padding-right: 2.5rem;
    }

    .button-row {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .button-row button {
        flex: 1;
        padding: 0.75rem;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        border: none;
    }

    .btn-primary {
        background-color: var(--primary);
        color: var(--text-light);
    }

    .btn-secondary {
        background-color: var(--bg-dark);
        color: var(--text);
        border: 1px solid var(--border);
    }

    .error {
        color: #ff6b6b;
    }

    .empty-state {
        text-align: center;
        padding: 2rem 1rem;
        color: var(--text-muted);
    }

    .empty-state p {
        margin: 0.5rem 0;
    }

    .hint {
        font-size: 0.9rem;
    }

    .players-list h3 {
        margin: 0 0 0.75rem 0;
        color: var(--text-muted);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .player-card {
        display: flex;
        align-items: center;
        background-color: var(--bg-light);
        border: 1px solid var(--border);
        border-radius: 8px;
        margin-bottom: 0.5rem;
        overflow: hidden;
    }

    .player-rank {
        padding: 0.5rem;
        font-weight: bold;
        color: var(--primary);
        min-width: 32px;
        flex-shrink: 0;
        text-align: center;
        font-size: 0.9rem;
    }

    .player-info {
        flex: 1;
        min-width: 0;  /* Allow flex item to shrink below content size */
        padding: 0.75rem 0;
        cursor: pointer;
    }

    .player-info:active {
        opacity: 0.7;
    }

    .player-name {
        font-weight: 500;
        color: var(--text);
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
    }

    .player-details {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-top: 0.2rem;
    }

    .player-actions {
        display: flex;
        gap: 0.25rem;
        padding: 0.5rem;
        flex-shrink: 0;  /* Don't shrink action buttons */
    }

    .btn-move {
        padding: 0.5rem;
        min-width: 36px;
        background-color: var(--bg-dark);
        color: var(--text-muted);
        border: 1px solid var(--border);
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
    }

    .btn-move:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .btn-move:not(:disabled):active {
        background-color: var(--border);
    }

    .btn-delete-small {
        padding: 0.5rem;
        min-width: 36px;
        background-color: transparent;
        color: #ff6b6b;
        border: 1px solid #ff6b6b33;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .btn-delete-small:active {
        background-color: rgba(255, 107, 107, 0.1);
    }
</style>
