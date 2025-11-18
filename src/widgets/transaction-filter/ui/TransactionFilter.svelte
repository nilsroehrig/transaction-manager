<script lang="ts">
  import Input from '@shared/ui/Input.svelte';
  import type { TransactionStatus, TransactionType } from '@entities/transaction/model.js';

  let {
    transactions,
    filterStatus = $bindable<'all' | TransactionStatus>('all'),
    filterType = $bindable<'all' | TransactionType>('all'),
    searchQuery = $bindable(''),
  } = $props();

  
  const stats = $derived({
    total: transactions.length,
    pending: transactions.filter((t) => t.status === 'pending').length,
    approved: transactions.filter((t) => t.status === 'approved').length,
    declined: transactions.filter((t) => t.status === 'declined').length,
    processed: transactions.filter((t) => t.status === 'processed').length,
    reverted: transactions.filter((t) => t.status === 'reverted').length,
    income: transactions
      .filter((t) => 
        t.type === 'income' && 
        (t.status === 'processed' || t.status === 'approved' || t.status === 'reverted')
      )
      .reduce((sum, t) => sum + t.amount, 0),
    expense: transactions
      .filter((t) => 
        t.type === 'expense' && 
        (t.status === 'approved' || t.status === 'reverted')
      )
      .reduce((sum, t) => sum + t.amount, 0),
  });

  const balance = $derived(stats.income - stats.expense);

  const uid = $props.id();
  const statusSelectId = `${uid}-status`;
  const typeSelectId = `${uid}-type`;
</script>

<div class="transaction-filter">
  <div class="filters">
    <div class="filter-group">
      <label for={statusSelectId}>Status</label>
      <select id={statusSelectId} bind:value={filterStatus} class="select">
        <option value="all">All</option>
        <option value="approved">Approved</option>
        <option value="declined">Declined</option>
        <option value="processed">Processed</option>
        <option value="reverted">Reverted</option>
      </select>
    </div>

    <div class="filter-group">
      <label for={typeSelectId}>Type</label>
      <select id={typeSelectId} bind:value={filterType} class="select">
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
    </div>

    <div class="filter-group filter-search">
      <Input
        label="Search"
        bind:value={searchQuery}
        placeholder="Search transactions..."
      />
    </div>
  </div>

  <div class="statistics">
    <div class="stat-item">
      <span class="stat-label">Total:</span>
      <span class="stat-value">{stats.total}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Approved:</span>
      <span class="stat-value">{stats.approved}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Reverted:</span>
      <span class="stat-value">{stats.reverted}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Income:</span>
      <span class="stat-value income">${stats.income.toFixed(2)}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Expense:</span>
      <span class="stat-value expense">${stats.expense.toFixed(2)}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Balance:</span>
      <span class="stat-value" class:positive={balance >= 0} class:negative={balance < 0}>
        ${balance.toFixed(2)}
      </span>
    </div>
  </div>
</div>

<style>
  .transaction-filter {
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }

  .filters {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .filter-group label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #333;
  }

  .filter-search {
    flex: 1;
    min-width: 200px;
  }

  .select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }

  .select:focus {
    outline: none;
    border-color: #ff3e00;
  }

  .statistics {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat-label {
    font-size: 0.85rem;
    color: #666;
  }

  .stat-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
  }

  .stat-value.income {
    color: #4caf50;
  }

  .stat-value.expense {
    color: #f44336;
  }

  .stat-value.positive {
    color: #4caf50;
  }

  .stat-value.negative {
    color: #f44336;
  }
</style>

