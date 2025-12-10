<script lang="ts">
  import api from "$lib/repository/api";
  import Button from "../../components/assets/forms/Button.svelte";

  type Response = {
    stdout: string;
    stderr: string;
  };
  let loading = $state({
    main: false,
    test: false,
  });
  let someLoading = $derived(loading.main || loading.test);

  let messages = $state({
    main: "",
    test: "",
  });

  async function implementMain() {
    const response = (await api.put("/ssh/implement", {
      branch: "main",
    })) as Response;

    messages.main =
      response.stdout.length > 0 ? response.stdout : response.stderr;
  }

  async function implementTest() {
    const response = (await api.put("/ssh/implement", {
      branch: "testing-new-mutex",
    })) as Response;

    messages.test =
      response.stdout.length > 0 ? response.stdout : response.stderr;
  }
</script>

<div class="min-h-screen bg-black text-green-400 font-mono p-6 overflow-hidden">
  <!-- Cabeçalho estilo terminal -->
  <div
    class="border border-green-600 rounded-lg p-4 mb-8 shadow-lg shadow-green-900/50"
  >
    <pre class="text-green-300 text-sm">
  ┌────────────────────────────────────────────────────┐
  │  <span class="text-green-100 font-bold text-lg">SFU MANAGER v2.0</span
      >                              │
  │  Sistema de Deploy Automatizado - Modo Terminal    │
  └────────────────────────────────────────────────────┘
    </pre>
  </div>

  <!-- Botões com visual retro -->
  <div class="flex flex-wrap gap-6 mb-10">
    <button
      class="px-8 py-4 bg-green-900/30 border-8 border-2 border-green-500 rounded-none
             hover:bg-green-800/50 active:bg-green-700 transition-all
             disabled:opacity-50 disabled:cursor-not-allowed
             shadow-md shadow-green-900/70 uppercase tracking-wider font-bold"
      disabled={someLoading}
      onclick={implementMain}
    >
      {#if someLoading}<span class="animate-pulse">█</span>{/if}
      [F5] Implementar MAIN Branch
    </button>

    <button
      class="px-8 py-4 bg-cyan-900/30 border-2 border-cyan-400 rounded-none
             hover:bg-cyan-800/50 active:bg-cyan-700 transition-all
             disabled:opacity-50 disabled:cursor-not-allowed
             shadow-md shadow-cyan-900/70 uppercase tracking-wider font-bold"
      disabled={someLoading}
      onclick={implementTest}
    >
      {#if someLoading}<span class="animate-pulse">█</span>{/if}
      [F6] Implementar TEST Branch
    </button>
  </div>

  <!-- Logs em duas colunas estilo terminal -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Coluna MAIN -->
    <div class="border border-green-700 bg-gray-950/70 rounded-lg p-5">
      <div class="flex items-center gap-3 mb-4">
        <span class="text-green-500 animate-pulse">●</span>
        <span class="text-yellow-400 uppercase tracking-widest"
          >MAIN → PRODUCTION</span
        >
        <span class="text-green-600 animate-pulse">online</span>
      </div>
      <pre class="text-green-300 text-sm leading-relaxed whitespace-pre-wrap">
{messages.main || "[$] Aguardando comando..."}
      </pre>
    </div>

    <!-- Coluna TEST -->
    <div class="border border-cyan-700 bg-gray-950/70 rounded-lg p-5">
      <div class="flex items-center gap-3 mb-4">
        <span class="text-cyan-400 animate-pulse">●</span>
        <span class="text-yellow-400 uppercase tracking-widest"
          >TEST → STAGING</span
        >
        <span class="text-cyan-500 animate-pulse">online</span>
      </div>
      <pre class="text-cyan-300 text-sm leading-relaxed whitespace-pre-wrap">
{messages.test || "[$] Aguardando comando..."}
      </pre>
    </div>
  </div>

  <!-- Rodapé estilo hacker -->
  <div class="mt-12 text-center text-green-800 text-xs">
    <span class="animate-pulse">█</span> Sistema operacional: Linux 6.9.3-xAI-custom
    • Uptime: 42d 13h 37m
  </div>
</div>

<style>
  pre {
    font-family: "Fira Code", "Courier New", monospace;
  }
  button:disabled {
    animation: none;
  }
</style>
