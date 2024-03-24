<script lang="ts">
	import { toast } from 'svelte-french-toast';
    import { goto } from "$app/navigation";
    import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";


    const auth = getAuth();
    
    const logIn = (e: Event) => {
        e.preventDefault();

        let email = document.getElementById("email") as HTMLInputElement;
        let password = document.getElementById("password") as HTMLInputElement;

        signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            userCredential.user;
            toast.success(`Usuário logado com sucesso!`);
            goto("/adm");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }
</script>


<main class="flex w-full h-svh">
    <section class="hidden lg:block relative w-full">
        <div class="flex justify-center absolute z-50 w-full items-center" id="teste" style="backdrop-filter: blur(7px); background-color: rgba(130, 130, 240, 0.397; height: 100svh">
            <img src="/faviconsartori.png" class="w-20 h-20" alt="logo">
        </div>
        
        <img src="/wallpaperLogin.avif" class="h-svh" alt="wallpaper engenharia elétrica">
    </section>

    <section class=" my-auto mx-auto w-full px-10">
        <form on:submit={logIn} class="flex flex-col max-w-lg mx-auto gap-10 justify-center ">
            <h1 class="text-3xl  text-black font-bold text-center">Entrar</h1>
    
            <div class="flex w-full flex-col gap-1.5">
                <Label for="email" class="text-md">E-mail</Label>
                <Input type="email" id="email" class="text-md py-4" placeholder="Digite o seu e-mail..." />
            </div>
        
            <div class="flex w-full flex-col gap-1.5">
                <Label for="password" class="text-md">Senha</Label>
                <Input type="password" class="text-md py-4" id="password" placeholder="Digite a sua senha" />
            </div>
    
            <button type="submit" class="bg-gray-800 p-2 w-full rounded-md text-xl font-semibold text-white">Entrar</button>
        </form>
    </section>
</main>