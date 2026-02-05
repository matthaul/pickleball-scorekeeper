<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { loadTeams, createTeam, deleteTeam, isTeamNameUnique } from '$lib/stores/teamState';
    import { toolbarStore } from '$lib/stores/toolbarStore';
    import type { Team } from '$lib/models/team';

    let teams: Team[] = [];
    let showAddForm = false;
    let newTeamName = '';
    let nameError = '';

    onMount(() => {
        teams = loadTeams();

        toolbarStore.setLeftButton({
            label: 'Add Team',
            action: () => showAddForm = true
        });
        toolbarStore.setMenuItems([
            { label: 'Home', href: `${base}/` }
        ]);
    });

    onDestroy(() => {
        toolbarStore.reset();
    });

    function handleAddTeam() {
        nameError = '';

        if (!newTeamName.trim()) {
            nameError = 'Team name is required';
            return;
        }

        if (!isTeamNameUnique(newTeamName)) {
            nameError = 'Team name already exists';
            return;
        }

        const team = createTeam(newTeamName);
        teams = loadTeams();
        newTeamName = '';
        showAddForm = false;

        // Navigate to edit the new team
        goto(`${base}/teams/${team.id}`);
    }

    function handleDeleteTeam(id: string) {
        deleteTeam(id);
        teams = loadTeams();
    }

    function cancelAdd() {
        showAddForm = false;
        newTeamName = '';
        nameError = '';
    }

    function getTeamStats(team: Team) {
        if (team.players.length === 0) {
            return { avgLevel: 0, maleCount: 0, femaleCount: 0 };
        }
        const totalLevel = team.players.reduce((sum, p) => sum + p.level, 0);
        const avgLevel = totalLevel / team.players.length;
        const maleCount = team.players.filter(p => p.gender === 'M').length;
        const femaleCount = team.players.filter(p => p.gender === 'F').length;
        return { avgLevel, maleCount, femaleCount };
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

<div class="banner banner-default">
    <h1>Teams</h1>
    <p>{teams.length} team{teams.length !== 1 ? 's' : ''}</p>
</div>

<div class="teams-container">
    {#if showAddForm}
        <div class="card add-form">
            <h2>New Team</h2>
            <form on:submit|preventDefault={handleAddTeam}>
                <div class="setting">
                    <label for="teamName">Team Name:</label>
                    <input
                        type="text"
                        id="teamName"
                        bind:value={newTeamName}
                        placeholder="Enter team name"
                        autofocus
                    />
                    {#if nameError}
                        <small class="error">{nameError}</small>
                    {/if}
                </div>
                <div class="button-row">
                    <button type="button" class="btn-secondary" on:click={cancelAdd}>Cancel</button>
                    <button type="submit" class="btn-primary">Create</button>
                </div>
            </form>
        </div>
    {/if}

    {#if teams.length === 0 && !showAddForm}
        <div class="empty-state">
            <p>No teams yet</p>
            <p class="hint">Tap "Add Team" to create one</p>
        </div>
    {:else}
        <div class="teams-list">
            {#each teams as team}
                {@const stats = getTeamStats(team)}
                <div class="team-card">
                    <a href="{base}/teams/{team.id}" class="team-link">
                        <div class="team-info">
                            <h2>{team.name}</h2>
                            <p>
                                {team.players.length} player{team.players.length !== 1 ? 's' : ''}
                                {#if team.players.length > 0}
                                    · Avg {stats.avgLevel.toFixed(1)} · {stats.maleCount}M {stats.femaleCount}F
                                {/if}
                            </p>
                        </div>
                    </a>
                    <button class="btn-delete" on:click={() => handleDeleteTeam(team.id)}>
                        Delete
                    </button>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .teams-container {
        padding: 1rem;
        max-width: 600px;
        margin: 0 auto;
        box-sizing: border-box;
        min-height: 100vh;
        padding-bottom: 80px;
    }

    .add-form {
        margin-bottom: 1rem;
    }

    .add-form h2 {
        margin: 0 0 1rem 0;
        color: var(--primary);
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
        padding: 3rem 1rem;
        color: var(--text-muted);
    }

    .empty-state p {
        margin: 0.5rem 0;
    }

    .hint {
        font-size: 0.9rem;
    }

    .teams-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .team-card {
        display: flex;
        align-items: center;
        background-color: var(--bg-light);
        border: 1px solid var(--border);
        border-radius: 8px;
        overflow: hidden;
    }

    .team-link {
        flex: 1;
        padding: 1rem;
        text-decoration: none;
        color: inherit;
    }

    .team-link:active {
        background-color: var(--bg-dark);
    }

    .team-info h2 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--primary);
    }

    .team-info p {
        margin: 0.25rem 0 0 0;
        font-size: 0.85rem;
        color: var(--text-muted);
    }

    .btn-delete {
        padding: 1rem;
        background-color: transparent;
        color: #ff6b6b;
        border: none;
        border-left: 1px solid var(--border);
        cursor: pointer;
        font-size: 0.9rem;
    }

    .btn-delete:active {
        background-color: rgba(255, 107, 107, 0.1);
    }
</style>
