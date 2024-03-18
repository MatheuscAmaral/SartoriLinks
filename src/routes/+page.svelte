<script lang="ts">
    import "../app.pcss";
    import { Switch } from "$lib/components/ui/switch";

    import { initializeApp } from 'firebase/app';
    import { getFirestore, collection, getDocs } from 'firebase/firestore';

    const firebaseApp = initializeApp({
        apiKey: "AIzaSyD71SwxlVTxVqfne-Vx5DsrZY1IGwkyxC0",
        authDomain: "sartorilinks.firebaseapp.com",
        projectId: "sartorilinks",
    });

   const db = getFirestore(firebaseApp);
   const userCollection = collection(db, "users");

   const getUsers = async () => {
        const usersDb = await getDocs(userCollection);
        const usersArray = usersDb.docs.map((user) => ({...user.data(), id: user.id}));
   }

   getUsers();

</script>

<main class="bg-gray-100">
    <div class="flex flex-col justify-center items-center h-svh gap-6 mx-auto max-w-3xl">
        <img src="/faviconsartori.png" alt="logo" class="w-24">
        
        <h1 class="text-2xl font-semibold text-gray-700">@sartorieletrica</h1>
        <Switch />
    
        <section class="grid grid-rows-4 gap-5 mt-5 w-full">
            <a href="https://www.google.com/maps/dir/-19.9364748,-44.069276/sartori+eletrica/@-19.933248,-44.0884877,15z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0xa695ca68053d29:0xb9efa65c70d471e9!2m2!1d-44.0865666!2d-19.9238107?entry=ttu" class="bg-gray-50  border border-gray-200 p-5 w-full rounded-md text-center" target="_blank">
                <p>Localização</p>
            </a>
            
            <a href="bvgjv" class="bg-gray-50  border border-gray-200 p-5 w-full rounded-md text-center">
                <p>Visite nosso site</p>
            </a>
        </section>
    </div>

</main>