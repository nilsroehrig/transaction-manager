<script lang="ts">
  import {
    getFullName
  } from "@entities/counterparty/model.js";
  import { counterpartyStore } from "@entities/counterparty/store.svelte";
  import { fetchRandomUsers } from "@entities/counterparty/api/randomUser.js";
  import Button from "@shared/ui/Button.svelte";
  import toast from "svelte-french-toast";

  let isLoading = $state(false);
  let counterparties = $derived(counterpartyStore.counterparties);

  async function handleAddNewCounterparty() {
    isLoading = true;
    try {
      const randomUsers = await fetchRandomUsers(1);
      if (randomUsers.length === 0) {
        toast.error("Failed to fetch random user");
        return;
      }
      const newCounterparty = counterpartyStore.addCounterparty(randomUsers[0]);
      toast.success(`Added counterparty: ${getFullName(newCounterparty)}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add counterparty"
      );
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="counterparties-page">
  <header class="page-header">
    <div>
      <h1>Counterparties</h1>
      <div class="counterparty-count">
        {counterparties.length}
        {counterparties.length === 1 ? "counterparty" : "counterparties"}
      </div>
    </div>
    <Button variant="primary" onclick={handleAddNewCounterparty} disabled={isLoading}>
      {isLoading ? "Adding..." : "+ New Counterparty"}
    </Button>
  </header>

  <div class="counterparties-list">
    {#if counterparties.length === 0}
      <div class="empty-state">
        <p>No counterparties found.</p>
        <p class="empty-hint">Add counterparties when creating a transaction.</p>
      </div>
    {:else}
      {#each counterparties as counterparty (counterparty.login.uuid)}
        <div class="counterparty-card">
          <img
            src={counterparty.picture.thumbnail}
            alt={getFullName(counterparty)}
            class="counterparty-avatar"
          />
          <div class="counterparty-info">
            <div class="counterparty-name">{getFullName(counterparty)}</div>
            <div class="counterparty-email">{counterparty.email}</div>
            <div class="counterparty-username">@{counterparty.login.username}</div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .counterparties-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
  }

  .page-header > div {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .page-header h1 {
    margin: 0;
    color: #333;
  }

  .counterparty-count {
    color: #666;
    font-size: 0.9rem;
  }

  .counterparties-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  .counterparty-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s;
  }

  .counterparty-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .counterparty-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .counterparty-info {
    flex: 1;
    min-width: 0;
  }

  .counterparty-name {
    font-weight: 600;
    color: #333;
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .counterparty-email {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .counterparty-username {
    font-size: 0.85rem;
    color: #999;
  }

  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
    color: #999;
  }

  .empty-state p {
    margin: 0.5rem 0;
  }

  .empty-hint {
    font-size: 0.9rem;
    color: #bbb;
  }

  @media (max-width: 768px) {
    .counterparties-list {
      grid-template-columns: 1fr;
    }

    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
</style>
