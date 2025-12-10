<script>
  let { children } = $props();
</script>

<div
  class="flex flex-col justify-center items-center w-full relative p-0.5 overflow-hidden rounded-xl"
>
  <div
    class="absolute w-[100%] h-[1000%] mascarazinha shrink-0 aspect-square rotate-animation origin-center"
  ></div>
  <div class="flex flex-col w-full">
    {@render children()}
  </div>
</div>

<style>
  :root {
    --complete: 0;
  }
  .mascarazinha {
    background: conic-gradient(
      from calc(var(--complete, 0) * 180deg) in hsl increasing hue,
      #0000 0 calc((1 - var(--complete)) * 10%),
      hsl(0 100% 65%) calc((1 - var(--complete)) * 20%),
      hsl(339 100% 65%) calc(100% - ((1 - var(--complete)) * 30%)),
      #0000 calc(100% - ((1 - var(--complete)) * 10%)) 100%
    );
  }

  .rotate-animation {
    animation: rotate 2s linear infinite;
  }

  /* Animação de rotação infinita */
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
