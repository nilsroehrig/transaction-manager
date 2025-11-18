<script lang="ts">
  import Input from '@shared/ui/Input.svelte';
  import Button from '@shared/ui/Button.svelte';
  import { transactionStore } from '@entities/transaction/store.svelte';
  import type { TransactionType } from '@entities/transaction/model.js';
  import toast from 'svelte-french-toast';

  let {
    selectedCounterpartyId,
    onsuccess,
    oncancel,
  } = $props();

  let type = $state<TransactionType>('expense');
  let amount = $state('');
  let description = $state('');
  let category = $state('');

  const counterpartyId = $derived(selectedCounterpartyId);

  const categories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Salary',
    'Freelance',
    'Other',
  ];

  function resetForm() {
    type = 'expense';
    amount = '';
    description = '';
    category = '';
  }

  function handleSubmit() {
    const numAmount = parseFloat(amount);
    if (!description.trim() || !category || isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    transactionStore.createTransaction({
      type,
      amount: numAmount,
      description: description.trim(),
      category,
      ...(counterpartyId && { counterpartyId }),
    });

    toast.success('Transaction created successfully');
    resetForm();
    onsuccess?.();
  }

  function handleCancel() {
    resetForm();
    oncancel?.();
  }
</script>

<form
  class="create-transaction-form"
  onsubmit={(e) => {
    e.preventDefault();
    handleSubmit();
  }}
>
  <div class="form-row">
    <label class="radio-group">
      <input
        type="radio"
        value="expense"
        bind:group={type}
      />
      <span>Expense</span>
    </label>
    <label class="radio-group">
      <input
        type="radio"
        value="income"
        bind:group={type}
      />
      <span>Income</span>
    </label>
  </div>

  <Input
    label="Amount"
    type="number"
    bind:value={amount}
    placeholder="0.00"
    required
    step="0.01"
    min="0.01"
    autofocus={true}
  />

  <Input
    label="Description"
    bind:value={description}
    placeholder="Enter description"
    required
  />

  <div class="form-row">
    <label for="category-select" class="select-label">
      Category&nbsp;<span class="required">*</span>
    </label>
    <select
      id="category-select"
      bind:value={category}
      class="select"
      required
    >
      <option value="">Select category</option>
      {#each categories as cat}
        <option value={cat}>{cat}</option>
      {/each}
    </select>
  </div>

  <div class="form-actions">
    {#if oncancel}
      <Button variant="secondary" onclick={handleCancel}>
        Cancel
      </Button>
    {/if}
    <Button
      variant="primary"
      onclick={handleSubmit}
      disabled={!description.trim() || !category || !amount || parseFloat(amount) <= 0}
    >
      Create Transaction
    </Button>
  </div>
</form>

<style>
  .create-transaction-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .form-row {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .radio-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .radio-group input[type="radio"] {
    cursor: pointer;
  }

  .select-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #333;
  }

  .required {
    color: #f44336;
  }

  .select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
    cursor: pointer;
  }

  .select:focus {
    outline: none;
    border-color: #ff3e00;
  }

  .form-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
</style>

