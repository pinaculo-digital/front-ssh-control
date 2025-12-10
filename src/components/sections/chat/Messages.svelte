<script lang="ts">
  import { onMount } from "svelte";
  import type { Message } from "$lib/repository/entitys/chat.dto";
  import { marked } from "marked";
  import Loading from "../../elements/loader/Loading.svelte";
  import References from "./References.svelte";
  import { cleanMarkdownLineBreaks } from "$lib/utils";

  interface Props {
    messages: Message[];
  }

  let { messages }: Props = $props();
</script>

<div class="flex-1 grow w-full p-4 space-y-4 overflow-hidden">
  {#each messages as message}
    {@const isAssistant = message.assistant}
    <div
      class="flex {isAssistant
        ? 'justify-start'
        : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300 overflow-hidden"
    >
      <div
        class="flex max-w-full lg:max-w-[900px] {isAssistant
          ? 'flex-row'
          : 'flex-row-reverse'} gap-3"
      >
        {#if isAssistant}
          <div class="flex flex-col">
            <div class="flex gap-2">
              {@render iaMessage(message)}
            </div>
            {#if !message.mocked}
              <div class="ml-1 mt-2">
                <References links={message.links} />
              </div>
            {/if}
          </div>
        {:else}
          {@render humanMessage(message)}
        {/if}
      </div>
    </div>
  {/each}
</div>

{#snippet iaMessage(message: Message)}
  <div
    class="px-3 lg:px-4 py-2 lg:py-3 rounded-2xl flex items-start justify-start flex-col shadow-sm bg-strong-950 text-white-0 border border-soft-200"
  >
    <div
      class="text-12 lg:text-sm markdown-content leading-loose text-left whitespace-pre-wrap break-all"
    >
      {#if message.mocked}
        {@html marked.parse(message.content + "...")}
      {:else}
        {@html marked.parse(message.content)}
      {/if}
    </div>

    <p class="text-[10px] lg:text-[11px] mt-1.5 text-gray-700 opacity-70">
      {new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </p>
  </div>
{/snippet}

{#snippet humanMessage(message: Message)}
  <div
    class="relative px-3 lg:px-4 py-1 lg:py-2 lg:pb-4 pb-4 rounded-xl min-w-20 shadow-sm bg-linear-to-r from-primary-base to-primary-darker text-white"
  >
    <p class="text-12 lg:text-sm leading-loose">
      {@html marked.parse(message.content)}
    </p>

    <p
      class="text-[10px] lg:text-[11px] bottom-3 right-3 mt-1.5 text-blue-100 leading-0 absolute opacity-70"
    >
      {new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </p>
  </div>
{/snippet}

<style>
  /* Animação de entrada suave */
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-in {
    animation: slideIn 0.3s ease-out;
  }
</style>
