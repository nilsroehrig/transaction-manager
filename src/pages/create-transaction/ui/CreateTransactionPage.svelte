<script lang="ts">
  import CreateTransactionForm from './CreateTransactionForm.svelte';
  import CounterpartySelectionWidget from '@widgets/counterparty-selection/ui/CounterpartySelectionWidget.svelte';

  let {
    onsuccess,
  } = $props();

  let selectedCounterpartyId = $state<string | undefined>(undefined);

  function handleSuccess() {
    selectedCounterpartyId = undefined;
    onsuccess?.();
  }

  function handleCancel() {
    selectedCounterpartyId = undefined;
    onsuccess?.();
  }
</script>

<div class="create-transaction-page">
  <header class="page-header">
    <h1>Create New Transaction</h1>
  </header>

  <div class="page-content">
    <aside class="sidebar">
      <CounterpartySelectionWidget
        bind:selectedCounterpartyId={selectedCounterpartyId}
      />
    </aside>

    <div class="form-section">
      <CreateTransactionForm
        selectedCounterpartyId={selectedCounterpartyId}
        onsuccess={handleSuccess}
        oncancel={handleCancel}
      />
    </div>
  </div>
</div>

<style>
  .create-transaction-page {
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

  .page-content {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }

  .sidebar {
    width: 300px;
    flex-shrink: 0;
  }

  .form-section {
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 768px) {
    .page-content {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
    }
  }
</style>

