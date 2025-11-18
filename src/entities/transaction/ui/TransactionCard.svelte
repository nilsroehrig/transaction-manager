<script lang="ts">
  import { fly } from 'svelte/transition';
  import type { Transaction } from '@entities/transaction/model.js';
  import { transactionStore } from '@entities/transaction/store.svelte';
  import { counterpartyStore } from '@entities/counterparty/store.svelte';
  import { getFullName, type Counterparty } from '@entities/counterparty/model.js';
  import Button from '@shared/ui/Button.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    transaction: Transaction;
    showActions?: boolean;
    onapprove?: (id: string) => void;
    ondecline?: (id: string) => void;
    onmarkprocessed?: (id: string) => void;
    revertButton?: Snippet<[{ transactionId: string; disabled: boolean }]>;
  }

  let {
    transaction,
    showActions = false,
    onapprove,
    ondecline,
    onmarkprocessed,
    revertButton,
  }: Props = $props();

  const isIncome = transaction.type === 'income';
  const isPending = transaction.status === 'pending';
  const isApproved = transaction.status === 'approved';
  const isProcessed = transaction.status === 'processed';
  const isReverted = transaction.status === 'reverted';

  const hasPendingReversal = $derived(
    transactionStore.transactions.some(
      (t) => t.reversesTransactionId === transaction.id && t.status === 'pending'
    )
  );

  let counterparty = $state<Counterparty | null>(null);

  $effect(() => {
    if (transaction.counterpartyId) {
      counterparty = counterpartyStore.getCounterpartyById(transaction.counterpartyId) || null;
    }
  });
</script>

{#snippet header()}
  <div class="card-header">
    <div class="amount" class:income={isIncome} class:expense={!isIncome}>
      {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
    </div>
    <div class="status" class:pending={isPending} class:approved={isApproved} class:declined={transaction.status === 'declined'} class:processed={isProcessed} class:reverted={isReverted}>
      {transaction.status}
    </div>
  </div>
{/snippet}

{#snippet body()}
  <div class="card-body">
    <h3 class="description">{transaction.description}</h3>
    <div class="meta">
      <span class="category">{transaction.category}</span>
      <span class="date">
        {new Date(transaction.createdAt).toLocaleDateString()}
      </span>
    </div>
    {#if transaction.counterpartyId && counterparty}
      <div class="counterparty">
        <img src={counterparty.picture.thumbnail} alt={getFullName(counterparty)} class="counterparty-avatar" />
        <span class="counterparty-name">{getFullName(counterparty)}</span>
      </div>
    {/if}
    {#if transaction.processedAt}
      <div class="processed">
        Processed: {new Date(transaction.processedAt).toLocaleString()}
      </div>
    {/if}
    {#if transaction.revertedBy}
      <div class="reverted">This transaction was reverted</div>
    {/if}
  </div>
{/snippet}

{#snippet actions()}
  <div class="card-actions">
    {#if isPending}
      {#if isIncome}
        {#if onmarkprocessed}
          <Button variant="primary" onclick={() => onmarkprocessed(transaction.id)}>
            Mark as Processed
          </Button>
        {/if}
      {:else}
        {#if onapprove}
          <Button variant="success" onclick={() => onapprove(transaction.id)}>
            Approve
          </Button>
        {/if}
        {#if ondecline}
          <Button variant="danger" onclick={() => ondecline(transaction.id)}>
            Decline
          </Button>
        {/if}
      {/if}
    {:else if (isApproved || isProcessed) && !isReverted && revertButton}
      {@render revertButton({ transactionId: transaction.id, disabled: hasPendingReversal })}
    {/if}
  </div>
{/snippet}

<div class="transaction-card" transition:fly={{ y: -10, duration: 200 }}>
  {@render header()}
  {@render body()}
  {#if showActions}
    {@render actions()}
  {/if}
</div>

<style>
  .transaction-card {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #ddd;
  }

  .transaction-card .income {
    border-left-color: #4caf50;
  }

  .transaction-card .expense {
    border-left-color: #f44336;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .amount {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .amount.income {
    color: #4caf50;
  }

  .amount.expense {
    color: #f44336;
  }

  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status.pending {
    background: #ff9800;
    color: white;
  }

  .status.approved {
    background: #4caf50;
    color: white;
  }

  .status.declined {
    background: #f44336;
    color: white;
  }

  .status.processed {
    background: #2196f3;
    color: white;
  }

  .status.reverted {
    background: #9e9e9e;
    color: white;
  }

  .card-body {
    margin-bottom: 0.75rem;
  }

  .description {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.1rem;
  }

  .counterparty {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .counterparty-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }

  .counterparty-name {
    font-size: 0.85rem;
    color: #666;
  }


  .meta {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: #666;
  }

  .category {
    font-weight: 500;
  }

  .processed {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: #999;
  }

  .reverted {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: #ff9800;
    font-weight: 500;
  }

  .card-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #eee;
  }
</style>

