<script lang="ts">
  import {
    getFullName,
    getCounterpartyId,
    type Counterparty,
  } from "@entities/counterparty/model.js";
  import { counterpartyStore } from "@entities/counterparty/store.svelte";
  import toast from "svelte-french-toast";

  let {
    selectedCounterpartyId = $bindable<string | undefined>(undefined),
  } = $props();

  const counterparties = $derived(counterpartyStore.counterparties);

  function handleSelectCounterparty(counterparty: Counterparty) {
    const counterpartyId = getCounterpartyId(counterparty);
    selectedCounterpartyId = counterpartyId;
    toast.success(`Selected counterparty: ${getFullName(counterparty)}`);
  }

  function isSelected(counterparty: Counterparty): boolean {
    return selectedCounterpartyId === getCounterpartyId(counterparty);
  }
</script>

<div class="counterparty-selection-widget">
  <div class="widget-header">
    <h3>Select Counterparty</h3>
  </div>

  {#if counterparties.length === 0}
    <div class="empty-state">
      <p>No counterparties available.</p>
      <p class="empty-hint">Add counterparties on the Counterparties page.</p>
    </div>
  {:else}
    <div class="users-list">
      {#each counterparties as counterparty}
        <div
          class="user-item"
          class:selected={isSelected(counterparty)}
          onclick={() => handleSelectCounterparty(counterparty)}
          onkeydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSelectCounterparty(counterparty);
            }
          }}
          role="button"
          tabindex="0"
        >
          <img
            src={counterparty.picture.thumbnail}
            alt={getFullName(counterparty)}
            class="user-avatar"
          />
          <div class="user-info">
            <div class="user-name">{getFullName(counterparty)}</div>
            <div class="user-email">{counterparty.email}</div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .counterparty-selection-widget {
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }

  .widget-header {
    margin-bottom: 0.75rem;
  }

  .counterparty-selection-widget h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
  }

  .empty-state {
    padding: 1rem;
    text-align: center;
    color: #666;
  }

  .empty-state p {
    margin: 0.25rem 0;
  }

  .empty-hint {
    font-size: 0.85rem;
    color: #999;
  }

  .users-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .user-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background 0.2s;
    cursor: pointer;
  }

  .user-item:hover {
    background: #f5f5f5;
  }

  .user-item:focus {
    outline: 2px solid #ff3e00;
    outline-offset: 2px;
  }

  .user-item.selected {
    background: #fff3e0;
    border: 2px solid #ff3e00;
    padding: calc(0.5rem - 2px);
  }

  .user-item.selected:hover {
    background: #ffe0b2;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-info {
    flex: 1;
    min-width: 0;
  }

  .user-name {
    font-weight: 500;
    color: #333;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  .user-email {
    font-size: 0.8rem;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

