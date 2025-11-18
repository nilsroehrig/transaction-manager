<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  }

  let {
    variant = 'primary',
    children,
    class: clazz,
    ...rest
  }: Props = $props();
</script>

<button
  {...rest}
  class="{clazz} btn btn-{variant}"
>
  {@render children()}
</button>

<style>
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
    font-weight: 500;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #ff3e00;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #e03500;
  }

  .btn-secondary {
    background: #f0f0f0;
    color: #333;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #e0e0e0;
  }

  .btn-success {
    background: #4caf50;
    color: white;
  }

  .btn-success:hover:not(:disabled) {
    background: #45a049;
  }

  .btn-danger {
    background: #f44336;
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    background: #da190b;
  }

  .btn-outline {
    background: transparent;
    border: 2px solid #ff3e00;
    color: #ff3e00;
  }

  .btn-outline:hover:not(:disabled) {
    background: #ff3e00;
    color: white;
  }
</style>

