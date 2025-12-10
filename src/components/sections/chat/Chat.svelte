<script lang="ts">
  import chatPersistence from "$lib/repository/persistence/chat.svelte";
  import Messages from "./Messages.svelte";

  let inputArea = $state<HTMLDivElement>();
</script>

{#if chatPersistence.selectedChat && chatPersistence.derivedChatSelect}
  {@const loadingInput = chatPersistence.derivedChatSelect.input.sendingMessage}
  <div class="flex flex-col justify-end grow h-full overflow-hidden relative">
    <div
      class="absolute left-0 top-0 w-full shrink-0 h-full pb-30 overflow-y-auto overflow-x-hidden"
      id="message-container"
    >
      <Messages messages={chatPersistence.derivedChatSelect.messages} />
    </div>
    {#if !loadingInput}
      <div
        class="relative px-3 lg:px-6 w-[99%] backdrop-blur-[2px] min-h-20 max-h-30 pb-2 lg:pb-4"
      >
        <div
          class="relative p-2 lg:p-4 w-full bg-white-0 flex border border-soft-200 rounded-xl grow text-[14px] shadow-lg"
        >
          <div
            role="textbox"
            contenteditable="true"
            data-text="Tire suas dúvidas com nossa IA"
            tabindex="-1"
            bind:this={inputArea}
            onchange={(e) => {
              inputArea?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }}
            onkeydown={(e) => {
              if (e.key == "Enter") {
                e.preventDefault();
                chatPersistence.sendMessage(chatPersistence.selectedChat);
              }
            }}
            class="placeholder:text-sub-600 text-14 lg:text-16 h-full max-h-40
            grow overflow-y-auto pl-1 lg:pl-2 leading-8 font-normal outline-0"
            bind:innerHTML={chatPersistence.derivedChatSelect.input.message}
          ></div>

          <button
            aria-label="Enviar"
            disabled={loadingInput}
            class="p-2 cursor-pointer not-disabled:hover:bg-primary-dark rounded-xl bg-primary-base self-end"
            onclick={() => {
              chatPersistence.sendMessage(chatPersistence.selectedChat);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              viewBox="0 0 256 256"
              ><path
                d="M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,.05-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z"
              ></path></svg
            >
          </button>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  [contentEditable="true"]:empty:not(:focus):before {
    content: attr(data-text);
    color: gray;
  }
</style>
