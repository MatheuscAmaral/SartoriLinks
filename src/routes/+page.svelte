<script lang="ts">
  import { onMount } from "svelte";
  import "../app.pcss";
  import { Switch } from "$lib/components/ui/switch";

  import db from "../routes/fb";
  import { collection, getDocs } from "firebase/firestore";
  interface ListProps {
    bg_color: string;
    color: string;
    href: string;
    title: string;
    border_color: string;
  }

  interface CompanyProps {
    name_company: string;
    logo: string;
  }

  let light = true;

  const listsCollection = collection(db, "lists");
  let lists: ListProps[] = [];

  const companyCollection = collection(db, "company");
  let company: CompanyProps[] = [];

  onMount(() => {
    const getLists = async () => {
      const listsDB = await getDocs(listsCollection);
      lists = listsDB.docs.map((list) => ({ ...list.data() }) as ListProps);

      const companyDB = await getDocs(companyCollection);
      company = companyDB.docs.map((c) => ({ ...c.data() }) as CompanyProps);
    };

    getLists();
  });

  const lightMode = () => {
    light = !light;
  };
</script>

<main class={`${light ? "bg-gray-100" : " bg-gray-950"}`}>
  <div
    class="flex flex-col justify-center items-center h-svh gap-6 mx-5 lg:mx-auto lg:max-w-3xl"
  >
    {#each company as c}
      <img src={c.logo} alt="logo" class={`w-28 rounded-full border-4 border-gray-300`} />

      <h1
        class={`text-2xl font-semibold ${light ? "text-gray-700" : "text-gray-200"}`}
      >
        @{c.name_company}
      </h1>
    {/each}

    <Switch on:click={lightMode} />

    <section class="grid grid-rows-4 gap-5 mt-5 w-full ">
      {#each lists as list}
        <a
          href={list.href}
          target="_blank"
          style={`background-color: ${list.bg_color}; color: ${list.color}; border-color: ${list.border_color}`}
          class={`border p-5 w-full rounded-md text-center`}
        >
          <p>{list.title}</p>
        </a>
      {/each}
    </section>
  </div>
</main>
