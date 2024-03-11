<script lang="ts">
    import "../app.pcss";
    import { Switch } from "$lib/components/ui/switch";
</script>

<main class="bg-gray-100">
    <div class="flex flex-col justify-center items-center h-svh gap-6 mx-auto max-w-3xl">
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="/faviconsartori.png" class="w-24">
        
        <h1 class="text-2xl font-semibold text-gray-700">@sartorieletrica</h1>
        <Switch />
    
        <section class="grid grid-rows-4 gap-5 mt-5 w-full">
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a href="#" class="bg-gray-50 border border-gray-200 p-5 w-full rounded-md text-center">
                <p>Acesse o portfólio</p>
            </a>
    
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a href="#" class="bg-gray-50  border border-gray-200 p-5 w-full rounded-md text-center">
                <p>Acesse o portfólio</p>
            </a>
    
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a href="#" class="bg-gray-50  border border-gray-200 p-5 w-full rounded-md text-center">
                <p>Acesse o portfólio</p>
            </a>
            
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a href="#" class="bg-gray-50  border border-gray-200 p-5 w-full rounded-md text-center">
                <p>Acesse o portfólio</p>
            </a>
        </section>
    </div>

</main>