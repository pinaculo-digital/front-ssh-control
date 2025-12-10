<script lang="ts">
  import { slide } from "svelte/transition";

  interface Props {
    links: string[];
  }

  let { links }: Props = $props();

  let show = $state(false);
</script>

<div
  class="flex flex-col text-12 lg:text-[14px] items-start w-full overflow-hidden max-w-full shrink"
>
  <button
    class="mb-1 cursor-pointer hover:underline text-left {show
      ? 'text-error-base'
      : 'text-primary-base'}"
    onclick={() => (show = !show)}
  >
    {show ? "Esconder links" : "Mostrar referências"}
  </button>
  {#if show}
    <div class="flex flex-col overflow-hidden w-[65vw] not-lg:w-[90vw]">
      {#each links as link}
        <a
          href={link}
          target="_blank"
          class="text-primary-base whitespace-nowrap hover:underline text-[12px]"
        >
          {link}
        </a>
      {/each}
    </div>
  {/if}
</div>
