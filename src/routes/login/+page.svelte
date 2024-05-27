<script lang="ts">
	import { toast } from 'svelte-french-toast';
    import { goto } from "$app/navigation";
    import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
    import { Loader } from "lucide-svelte";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";

    let loading = false;

    const auth = getAuth();
    
    const logIn = (e: Event) => {
    e.preventDefault();
    loading = true;

    let email = document.getElementById("email") as HTMLInputElement;
    let password = document.getElementById("password") as HTMLInputElement;

    signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
        toast.success(`Usuário logado com sucesso!`, {
            position: 'bottom-right'
        });
        goto("/adm");
    })
    .catch(() => {
    })
    .finally(() => {
        loading = false;
    });
}

</script>


<main class="flex max-w-screen w-full h-svh">
    <section class="hidden lg:block relative w-full">
        <div class="flex justify-center absolute z-50 h-svh w-full items-center" style="backdrop-filter: blur(6px); background-color: rgba(130, 130, 240, 0.397; height: 100svh">
            <img src="/faviconsartori.png" class="w-20 h-20" alt="logo">
        </div>
        
        <img src="/wallpaperLogin.avif" class="h-svh" alt="wallpaper engenharia elétrica">
    </section>

    <section class="my-auto mx-auto w-full px-10">
        <form on:submit={logIn} class="flex flex-col max-w-lg mx-auto gap-6 justify-center ">
            <h1 class="text-4xl text-black font-bold text-center mb-8">Entrar <span style={`color: #000`}>com</span></h1>
    
            <div class="flex w-full flex-col gap-1.5">
                <Label for="email" class="text-sm text-gray-500">E-mail *</Label>
                <Input type="email" id="email" class="text-md py-6"required placeholder="Digite o seu e-mail" />
            </div>
        
            <div class="flex w-full flex-col gap-1.5">
                <Label for="password" class="text-sm text-gray-500">Senha *</Label>
                <Input type="password" class="text-md py-6" required id="password" placeholder="Digite a sua senha" />
            </div>
    
            <button type="submit" class="bg-gray-800 p-3 w-full rounded-md text-md font-medium text-white">
                {#if loading}
                    <div class="flex justify-center">
                        <Loader class="animate-spin"/>
                    </div>
                    {:else}
                    Salvar
                {/if}
            </button>
        </form>
    </section>
</main>