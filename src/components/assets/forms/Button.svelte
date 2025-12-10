<script lang="ts">
  import type { Component, Snippet } from "svelte";
  import type { SVGAttributes } from "svelte/elements";
  import Loading from "../../elements/loader/Loading.svelte";

  type Temas =
    | "default"
    | "primary"
    | "red"
    | "black"
    | "green"
    | "transparent"
    | "blue-transparent"
    | "red-transparent"
    | "black-transparent"
    | "gray-transparent"
    | "primary-gradient"
    | "red-transparent-inverted"
    | "desabilitado"
    | "b-astronfy"
    | "discord"
    | "hostinger"
    | "primary-ghost";

  interface Props {
    children: Snippet;
    theme: Temas;
    onClick?: VoidFunction;
    disabled?: boolean;
    height?: string;
    width?: string;
    loading?: boolean;
    type: "submit" | "button";
  }
  //Caso queira alterar a altura desse componente, é possivel fazer externamente a ele, use uma div flex e sete uma altura que ele se comporta de acordo
  //Caso precise de algum css especifico, adicione temas
  //Proibido botar: width,height,padding -> Sujeito a paulada

  let {
    children,
    theme,
    onClick = () => {},
    loading,
    disabled,
    type,
    height = "h-[40px]",
    width = "w-auto",
  }: Props = $props();

  let buttonPressed = $state(false);

  const temaStyle = (): string => {
    if (theme === "blue-transparent") {
      return "text-primary-base  border border-primary-base hover:border-transparent hover:bg-primary-alpha-10 disabled:bg-primary-darker";
    }

    if (theme === "red-transparent") {
      return "text-error-base border border-error-base hover:border-transparent hover:bg-alpha-red-alpha-10 disabled:bg-red-600";
    }

    if (theme === "red-transparent-inverted") {
      return "text-error-base border hover:border-error-base border-transparent hover:bg-transparent bg-error-base/10 disabled:bg-red-600";
    }

    if (theme === "black-transparent") {
      return "text-strong-950 border border-strong-950 hover:border-transparent hover:bg-weak-50 disabled:bg-surface-800";
    }

    if (theme === "gray-transparent") {
      return "text-sub-600 border border-soft-200 hover:border-transparent hover:bg-soft-200 hover:text-strong-950";
    }

    if (theme === "transparent") {
      return "text-sub-600 hover:bg-soft-200 dark:hover:text-static-white hover:text-static-black border border-soft-200";
    }
    if (theme === "green")
      return "bg-[#1DAF61] disabled:brightness-75 text-static-white";

    if (theme === "primary") {
      return `text-white font-medium leading-tight tracking-wide bg-primary-dark not-dark:bg-primary-base 
        hover:bg-primary-darker disabled:text-disabled-300 disabled:bg-weak-50`;
    }
    if (theme === "primary-ghost") {
      return "text-static-white font-medium leading-tight tracking-wide disabled:text-disabled-300 disabled:bg-weak-50";
    }

    if (theme === "red") {
      return "text-static-white bg-error-base hover:bg-red-600 disabled:bg-red-600";
    }

    if (theme === "hostinger") {
      return "text-static-white bg-primary-base";
    }

    if (theme === "black") {
      return "text-static-white dark:text-static-black bg-strong-950 hover:bg-surface-800 disabled:bg-surface-800";
    }

    if (theme === "primary-gradient") {
      return `disabled:text-disabled-300 not-disabled:text-static-white font-medium 
        leading-tight tracking-wide not-disabled:border not-disabled:border-primary-dark primary-gradient`;
    }

    if (theme === "b-astronfy")
      return "text-static-white font-medium leading-tight tracking-wide bg-primary-base";

    if (theme === "desabilitado")
      return "bg-weak-50 text-disabled-300 pointer-events-none";

    if (theme === "discord")
      return "bg-[#5865F2] text-white hover:bg-primary-base";

    return "";
  };

  function press() {
    buttonPressed = true;
    setTimeout(() => {
      buttonPressed = false;
    }, 300);
  }
</script>

<!-- 
    @component
      Cores de background,bordar e texto, são fixos baseados na variavel "tema"
      Caso queira adicionar icones, ou fazer qualquer botão complexo, sinta-se livre para utilizar divs complexas dentro do botão
    Uso:
      ```tsx
    <Botao onClick={function}>
      <Icone/>
      Texto Bacana
      <Icone/>
    </Botao>
          
  -->

<button
  class="text-14 group relative flex transform cursor-pointer items-center justify-center gap-2 rounded-[10px] p-1 px-2 font-medium
    transition-transform duration-1000
     disabled:cursor-auto
    {height} {width} {temaStyle()}"
  onclick={() => {
    press();
    onClick();
  }}
  {type}
  disabled={loading || disabled ? true : null}
>
  {#if loading}
    <div class="flex w-20 items-center justify-center">
      <Loading />
    </div>
  {:else}
    {@render children()}
  {/if}
</button>

<style>
  :global(.primary-gradient) {
    background: linear-gradient(
      0deg,
      var(--color-primary-base) 0%,
      color-mix(in srgb, var(--color-primary-base) 100%, black 4%) 50%,
      var(--color-primary-base) 100%
    );
    box-shadow: inset 0px 0px 0px 2px
      color-mix(in srgb, var(--color-primary-base) 100%, white 20%);
  }
  :global(.primary-gradient:disabled) {
    background: var(--color-weak-50);
    box-shadow: none;
  }
</style>
