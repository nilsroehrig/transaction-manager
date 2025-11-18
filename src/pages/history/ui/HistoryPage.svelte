<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { transactionStore } from '@entities/transaction/store.svelte';
  import TransactionCard from '@entities/transaction/ui/TransactionCard.svelte';
  import TransactionFilter from '@widgets/transaction-filter/ui/TransactionFilter.svelte';
  import RevertTransactionButton from './RevertTransactionButton.svelte';

  let filterStatus = $state('all');
  let filterType = $state('all');
  let searchQuery = $state('');

  const processedTransactions = $derived(
    transactionStore.transactions.filter(
      (t) => t.status === 'approved' || t.status === 'declined' || t.status === 'processed' || t.status === 'reverted'
    )
  );

  const filteredTransactions = $derived(
    processedTransactions.filter((t) => {
      if (filterStatus !== 'all' && t.status !== filterStatus) {
        return false;
      }
      if (filterType !== 'all' && t.type !== filterType) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          t.amount.toString().includes(query)
        );
      }
      return true;
    })
  );
</script>

{#snippet revertButtonSnippet({ transactionId, disabled })}
  <RevertTransactionButton
    {transactionId}
    {disabled}
    onrevert={undefined}
  />
{/snippet}

<div class="history-page">
  <header class="page-header">
    <h1>Transaction History</h1>
  </header>

  <TransactionFilter
    transactions={processedTransactions}
    bind:filterStatus={filterStatus}
    bind:filterType={filterType}
    bind:searchQuery={searchQuery}
  />

  <div class="transactions-list">
    {#if filteredTransactions.length === 0}
      <div class="empty-state" transition:fade={{ duration: 200 }}>
        <p>No processed transactions found.</p>
      </div>
    {:else}
      {#each filteredTransactions as transaction (transaction.id)}
        <div transition:fly={{ y: -10, duration: 200 }}>
          <TransactionCard
            transaction={transaction}
            showActions={(transaction.status === 'approved' || transaction.status === 'processed') && !transaction.revertedBy}
            revertButton={revertButtonSnippet}
          />
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .history-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
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

