<script lang="ts">
  import { fade } from "svelte/transition";

  interface Props {
    value: string | number | null;
    label: string;
    disabled?: boolean;
    error?: boolean | string;
    placeholder?: string;
    isPassword?: boolean;
  }

  let {
    value = $bindable(),
    label = "",
    disabled = false,
    error = $bindable(),
    placeholder = "",
    isPassword = false,
  }: Props = $props();

  let focused = $state(false);

  let showError = $derived(error && !focused);
  const inputCss = $derived(
    `w-full px-3 py-2 bg-transparent border
    sm:text-14 text-12
    ${showError ? "border-error-base" : "border-soft-200"} 
    rounded-lg focus:outline-none input-focus-ring
    autofill:bg-transparent
    autofill:text-strong-950
    autofill:shadow-nones
    `
  );
</script>

<div class="relative flex flex-col gap-1 lg:gap-2 w-full">
  <label
    for={label}
    class="block text-12 sm:text-14 font-semibold text-strong-950"
  >
    {label}
  </label>
  {#if !isPassword}
    <input
      id={label}
      type="text"
      bind:value
      {placeholder}
      class={inputCss}
      {disabled}
      onfocus={() => (focused = true)}
      onblur={() => (focused = false)}
      oninput={() => (error = "")}
    />
  {:else}
    <input
      id="name"
      type="password"
      bind:value
      placeholder="********"
      class={inputCss}
      onfocus={() => (focused = true)}
      onblur={() => (focused = false)}
      oninput={() => (error = "")}
      {disabled}
    />
  {/if}
  {#if showError}
    <p
      transition:fade={{ duration: 200 }}
      class="text-12 sm:text-14 text-red-600 dark:text-red-400 flex items-center gap-1"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
        ><path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        ></path></svg
      >
      {error}
    </p>
  {/if}
</div>
