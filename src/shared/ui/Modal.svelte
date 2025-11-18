<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import Button from './Button.svelte';

  interface Props {
    open?: boolean;
    title?: string;
    onclose?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    onconfirm?: () => void;
    oncancel?: () => void;
    showFooter?: boolean;
    children?: import('svelte').Snippet;
  }

  let {
    open = $bindable(false),
    title,
    onclose,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onconfirm,
    oncancel,
    showFooter = true,
    children,
  }: Props = $props();

  let dialogElement = $state<HTMLDialogElement | undefined>(undefined);

  $effect(() => {
    if (!dialogElement) return;
    if (open) {
      dialogElement.showModal();
    } else {
      dialogElement.close();
    }
  });

  function handleClose() {
    open = false;
    onclose?.();
  }

  function handleConfirm() {
    onconfirm?.();
    handleClose();
  }

  function handleCancel() {
    oncancel?.();
    handleClose();
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === dialogElement) {
      handleClose();
    }
  }
</script>

{#snippet header()}
  <div class="modal-header">
    <h2 id="modal-title">{title}</h2>
  </div>
{/snippet}

{#snippet body(children)}
  <div class="modal-body">
    {#if children}
      {@render children()}
    {/if}
  </div>
{/snippet}

{#snippet footer()}
  <div class="modal-footer">
    <Button variant="secondary" onclick={handleCancel}>
      {cancelLabel}
    </Button>
    {#if onconfirm}
      <Button variant="primary" onclick={handleConfirm}>
        {confirmLabel}
      </Button>
    {/if}
  </div>
{/snippet}

{#if open}
  <dialog
    bind:this={dialogElement}
    class="modal-dialog"
    aria-labelledby="modal-title"
    onclick={handleBackdropClick}
  >
    <div
      class="modal-content"
      transition:fly={{ y: -20, duration: 200 }}
      onclick={(e) => e.stopPropagation()}
    >
      {@render header()}
      {@render body(children)}
      {#if showFooter}
        {@render footer()}
      {/if}
    </div>
  </dialog>
{/if}

<style>
  :global(.modal-dialog) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 0;
    border: none;
    background: transparent;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
  }

  :global(.modal-dialog::backdrop) {
    background: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    background: white;
    border-radius: 8px;
    max-width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
  }

  .modal-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-footer {
    padding: 1.5rem;
    border-top: 1px solid #eee;
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }
</style>

