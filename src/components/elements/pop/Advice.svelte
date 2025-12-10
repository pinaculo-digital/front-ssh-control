<script lang="ts">
  import { portal } from "$lib/actions/portal.svelte";
  import signal from "$lib/global/signal.svelte";
  import { scale, slide } from "svelte/transition";
  import Button from "../../assets/forms/Button.svelte";
  import Ollama from "../../assets/icons/Ollama.svelte";

  let open = $state(false);

  let data = $state<{
    title: string;
    desc: string;
  }>({
    title: "Parece que atingiu seu limite com o chat",
    desc: "Tente novamente amanhã, e aprenda um pouco com o que vistes hoje comigo :D",
  });

  signal.onSubscribe("spawnAdvice", async (d) => {
    if (!d || !d.desc || !d.title) {
      return;
    }
    open = true;

    data.title = d.title;
    data.desc = d.desc;
  });
</script>

{#if open}
  <div
    use:portal={"body"}
    class="bg-white-0/20 text-strong-950 not-sm:p-6 fixed top-0 left-0 z-10 flex h-full w-full items-center justify-center backdrop-blur-[1px]"
  >
    <button
      aria-label="Sair do Modal"
      class=" absolute top-0 left-0 z-0 h-full w-full"
      onclick={() => (open = false)}
    >
    </button>
    <div
      class="bg-weak-100 py-8 text-center border-soft-200/10 relative w-full sm:w-[400px] rounded-xl border flex justify-center flex-col items-center"
      transition:scale={{ duration: 200 }}
    >
      <Ollama
        props={{
          class: "fill-strong-950 w-24",
        }}
      />
      <div class="flex flex-col gap-1 p-5 text-16 py-4">
        {data.title}
        <p class="text-14 text-sub-600 text-center">
          {data.desc}
        </p>
      </div>
      <div
        class="border-soft-200 flex w-full justify-center items-center p-5 pb-0"
      >
        <Button
          type="button"
          theme="red"
          width="w-[300px]"
          onClick={() => {
            open = false;
          }}
        >
          Ok, eu compreendo
        </Button>
      </div>
    </div>
  </div>
{/if}
