<script lang="ts">
  import { page } from "$app/state";
  import chatPersistence from "$lib/repository/persistence/chat.svelte";
  import Button from "../../assets/forms/Button.svelte";

  chatPersistence.list();
</script>

<aside
  class="w-[300px] shrink-0 overflow-hidden bg-white-0 backdrop-blur-xl border-r border-soft-400
  h-full flex flex-col shadow-xl"
>
  <!-- Header -->
  <div class="p-4 border-b border-soft-400">
    <h1 class="text-xl font-semibold text-strong-950">Chats</h1>
    <p class="text-xs text-sub-600 mt-0.5">Suas conversas com UFCHAT</p>
  </div>

  <!-- Chat List -->
  <div
    class="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
  >
    {#if chatPersistence.chats.size > 0}
      <ul class="pt-2 px-3 pb-4">
        {#each chatPersistence.chats as [key, chat]}
          {@const isActive = chat.id === chatPersistence.selectedChat}
          <li class="relative flex group items-center">
            <button
              onclick={() => {
                chatPersistence.select(chat.id);
                if (chatPersistence.derivedChatSelect?.messages.length === 0) {
                  chatPersistence.listMessages(chat.id, 1);
                }
              }}
              class="group text-left cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 my-1
              rounded-xl transition-all duration-200
                     {isActive
                ? 'bg-linear-to-r from-primary-base to-primary-dark text-white-0 shadow-md'
                : 'hover:bg-disabled-300 hover:shadow-sm'}"
            >
              <!-- Ícone de chat -->
              <div class="flex shrink-0 w-5 h-5">
                <svg
                  class="w-full h-full fill-strong-950"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.854C2.492 12.322 2 11.184 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <span
                class="flex-1 text-sm font-medium text-strong-950 truncate pr-2"
              >
                {chat.title || "Nova conversa"}
              </span>
            </button>
            <button
              class="bg-error-base opacity-0 group-hover:opacity-100 duration-200 transition-all p-1 rounded-lg cursor-pointer absolute right-3"
              aria-label="Excluir chat"
              onclick={() => chatPersistence.delete(chat.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="white"
                viewBox="0 0 256 256"
                ><path
                  d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
                ></path></svg
              >
            </button>
          </li>
        {/each}
      </ul>
    {:else}
      <div class="text-center py-12 text-soft-200">
        <svg
          class="w-12 h-12 mx-auto mb-3 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p class="text-sm">Nenhuma conversa ainda</p>
      </div>
    {/if}
  </div>

  <!-- Footer: Novo Chat -->
  <div class="p-3 border-t border-soft-400 grid w-full">
    <Button
      onClick={() => {
        chatPersistence.createChat();
      }}
      loading={chatPersistence.isCreatingChat}
      theme="primary"
      type="button"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
      Novo Chat
    </Button>
  </div>
</aside>
