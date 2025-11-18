<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { transactionStore } from '@entities/transaction/store.svelte';
  import TransactionCard from '@entities/transaction/ui/TransactionCard.svelte';
  import Button from '@shared/ui/Button.svelte';

  let {
    onCreateTransaction,
  } = $props();

  const pendingTransactions = $derived(
    transactionStore.transactions.filter((t) => t.status === 'pending')
  );

  function handleApprove(id: string) {
    transactionStore.approveTransaction(id);
  }

  function handleDecline(id: string) {
    transactionStore.declineTransaction(id);
  }

  function handleMarkProcessed(id: string) {
    transactionStore.markAsProcessed(id);
  }
</script>

<div class="inbox-page">
  <header class="page-header">
    <h1>Transaction Inbox</h1>
    <Button
      variant="primary"
      onclick={() => onCreateTransaction?.()}
    >
      + New Transaction
    </Button>
  </header>

  <div class="transactions-list">
    {#if pendingTransactions.length === 0}
      <div class="empty-state" transition:fade={{ duration: 200 }}>
        <p>No pending transactions found.</p>
      </div>
    {:else}
      {#each pendingTransactions as transaction (transaction.id)}
        <div transition:fly={{ y: -10, duration: 200 }}>
          <TransactionCard
            transaction={transaction}
            showActions={true}
            onapprove={handleApprove}
            ondecline={handleDecline}
            onmarkprocessed={handleMarkProcessed}
          />
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .inbox-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .page-header h1 {
    margin: 0;
    color: #333;
  }

  .transactions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #999;
  }
</style>

