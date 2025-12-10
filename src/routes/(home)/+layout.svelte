<script lang="ts">
  import { goto } from "$app/navigation";
  import userSession from "$lib/repository/persistence/user.svelte";
  import { onMount } from "svelte";

  let { children } = $props();
  userSession.parseInfoFromLocalStorage();
</script>

<div class="w-full h-full overflow-hidden">
  {#if userSession.info.authorized}
    {@render children()}
  {/if}
</div>
