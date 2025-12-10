<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    AuthController,
    SignInSchema,
    type SignIn,
  } from "$lib/repository/controllers/auth.controller";
  import { validateSchema } from "$lib/repository/entitys/util.dto";
  import Button from "../../../components/assets/forms/Button.svelte";
  import Input from "../../../components/assets/forms/Input.svelte";

  let form = $state<SignIn>({
    email: "",
    password: "",
  });
  let errors = $state<SignIn>({
    email: "",
    password: "",
  });

  let loading = $state(false);
  let serverError = $state<string | null>("");

  function validate() {
    errors = { email: "", password: "" };
    const x = validateSchema(SignInSchema, form);

    if (x.errors) {
      errors = x.errors as any;
    }
    return x;
  }

  async function login() {
    if (!validate().valid) return;

    loading = true;
    const auth = new AuthController();
    try {
      const response = await auth.login(form);
      localStorage.setItem("ssh_token", response.token);
      goto("/");
    } catch (err: any) {
      serverError = "Email ou senha incorretos, tente novamente";
      setTimeout(() => {
        serverError = "";
      }, 6000);
    }

    loading = false;
  }
</script>

<div
  class="rounded-xl w-full sm:w-[400px] flex flex-col items-center sm:border z-10 sm:bg-white-0 border-soft-200/20 py-7 px-3 sm:px-10"
>
  <h2 class="text-16 my-2">ADMIN CONTROLLER SFU SYSTEM</h2>

  <form class="flex flex-col gap-3 w-full" onsubmit={login}>
    <Input
      label="Login"
      bind:value={form.email}
      placeholder="Ex: João da Silva"
      bind:error={errors.email}
      disabled={false}
      isPassword={false}
    />
    <Input
      label="Senha"
      bind:value={form.password}
      placeholder="********"
      bind:error={errors.password}
      disabled={false}
      isPassword={true}
    />
    <div class="mt-0.5"></div>
    <Button theme="primary" type="submit" {loading}>Logar</Button>
  </form>
  <div class="flex items-center text-12 sm:text-14 gap-2 mt-4">
    Não tens uma conta?
    <button
      onclick={() => goto("/register")}
      class="cursor-pointer text-primary-base underline"
    >
      Crie uma
    </button>
  </div>

  {#if serverError}
    <p class="text-error-base text-14 mt-3 h-2">{serverError}</p>
  {/if}
</div>
