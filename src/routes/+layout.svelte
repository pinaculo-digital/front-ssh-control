<script lang="ts">
  import { assets } from "$lib/global/global.svelte";
  import "../app.css";
  import Advice from "../components/elements/pop/Advice.svelte";
  let { children } = $props();
</script>

<svelte:head>
  <title>UFCHAT</title>

  <link rel="stylesheet" href={assets("/themes/root.css")} />
  <link rel="stylesheet" href={assets("/themes/dark.css")} />
</svelte:head>

<div
  class="w-screen h-svh bg-white-0 overflow-hidden text-strong-950
         pt-[env(safe-area-inset-top,0px)]
         pr-[env(safe-area-inset-right,0px)]
         pb-[env(safe-area-inset-bottom,0px)]
         pl-[env(safe-area-inset-left,0px)]
         box-border"
  style="--safe-top: env(safe-area-inset-top, 0px);
         --safe-bottom: env(safe-area-inset-bottom, 0px);"
>
  {@render children?.()}
</div>

<Advice />
