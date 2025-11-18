<script lang="ts">
  import { autofocus } from '@shared/lib/attachments.js';
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface InputProps extends HTMLInputAttributes {
    label?: string;
    autofocus?: boolean;
  }

  let {
    label,
    value = $bindable(),
    required = false,
    autofocus: shouldAutofocus = false,
    class: clazz,
    id,
    ...rest
  }: InputProps = $props();

  const uid = $props.id();
  const inputId = id || `${uid}-input`;
</script>

<div class="input-group">
  {#if label}
    <label for={inputId} class="input-label">
      {label}
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}
  <input
    id={inputId}
    bind:value
    {required}
    class="input {clazz || ''}"
    {@attach (element) => autofocus(element, shouldAutofocus)}
    {...rest}
  />
</div>

<style>
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #333;
  }

  .required {
    color: #f44336;
  }

  .input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .input:focus {
    outline: none;
    border-color: #ff3e00;
  }

  .input:invalid {
    border-color: #f44336;
  }
</style>

