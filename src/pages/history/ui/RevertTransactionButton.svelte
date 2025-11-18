<script>
  import Button from '@shared/ui/Button.svelte';
  import Modal from '@shared/ui/Modal.svelte';
  import { transactionStore } from '@entities/transaction/store.svelte';
  import toast from 'svelte-french-toast';

  let {
    transactionId,
    onrevert,
    disabled = false,
  } = $props();

  let showModal = $state(false);
  let isReverting = $state(false);

  function handleRevert() {
    showModal = true;
  }

  async function confirmRevert() {
    isReverting = true;
    try {
      const reverted = transactionStore.revertTransaction(transactionId);
      toast.success('Transaction reverted successfully');
      onrevert?.(reverted);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to revert transaction');
    } finally {
      isReverting = false;
      showModal = false;
    }
  }

</script>

<Button
  variant="outline"
  onclick={handleRevert}
  disabled={isReverting || disabled}
>
  {#if isReverting}
    Reverting...
  {:else if disabled}
    Reversal pending
  {:else}
    Revert
  {/if}
</Button>

<Modal
  bind:open={showModal}
  title="Revert Transaction"
  confirmLabel="Revert"
  cancelLabel="Cancel"
  onconfirm={confirmRevert}
>
  <p>Create a reversal transaction?</p>
</Modal>

