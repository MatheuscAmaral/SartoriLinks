<script lang="ts">
  import db from "../fb";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
  import { Dropzone } from "flowbite-svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { LoaderCircle } from "lucide-svelte";

  interface ListsProps {
    bg_color: string;
    color: string;
    href: string;
    title: string;
    border_color: string;
  }

  interface CompanyProps {
    id: string;
    name_company: string;
    logo: string;
  }

  let loading = false;
  let name_company = "";
  let image: string = "";
  let value: string[] = [];
  let lists: ListsProps[] = [];
  let company: CompanyProps[] = [];

  let href = "#";
  let border_color = "#d1cdcd";
  let color = "#000";
  let bg_color = "#fff";
  let title: string = "Título";

  const dropHandle = (event: DragEvent) => {
    value = [];
    event.preventDefault();

    if (event.dataTransfer.items) {
      [...event.dataTransfer.items].forEach((item, i) => {
        if (item.kind === "file") {
          const file = item.getAsFile();

          value.push(file.name);
          value = value;
        }
      });
    } else {
      [...event.dataTransfer.files].forEach((file, i) => {
        value = file.name;
      });
    }
  };

  const handleChange = (e: Event) => {
    const files = e.target.files;

    if (files.length > 0) {
      value.push(files[0].name);
      value = value;

      image = URL.createObjectURL(files[0]);
      console.log(image);
    }
  };

  const listsCollection = collection(db, "lists");
  const companyCollection = collection(db, "company");
  const companyDoc = doc(db, "company", "1dgcd0kzeWEgKz2NxwUn");

  const getData = async () => {
    loading = true;

    try {
      const companyDb = await getDocs(companyCollection);
      company = companyDb.docs.map((c) => ({ ...c.data() }) as CompanyProps);
      name_company = company[0].name_company;
      image = company[0].logo;

      const listsDb = await getDocs(listsCollection);
      lists = listsDb.docs.map((list) => ({ ...list.data() }) as ListsProps);
    } catch {
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    getData();
  });

  const updateCompanyData = async () => {
    await updateDoc(companyDoc, {
      name_company: name_company,
      logo: image,
    });

    getData();
  };

  //    import { getAuth, onAuthStateChanged } from "firebase/auth";
  //    import { goto } from "$app/navigation";

  //    onMount(() => {
  //         const auth = getAuth();

  //         onAuthStateChanged(auth, (user) => {
  //             if(user) {
  //                 console.log("Usuário logado!");
  //             } else {
  //                 console.log("Usuário não encontrado");
  //                 goto("/adm/login");
  //             }
  //         })
  //    });
</script>

<main class="max-w-4xl mx-10 lg:mx-auto grid grid-cols-1 gap-10 mt-20">
  <div class="flex justify-center">
    <Dialog.Root>
      <Dialog.Trigger
        class={`${buttonVariants({ variant: "outline" })} absolute right-20`}
        >Editar</Dialog.Trigger
      >
      <Dialog.Content class="sm:max-w-[600px]">
        <Dialog.Header>
          <Dialog.Title>Editar dados</Dialog.Title>
          <Dialog.Description>
            Edite os dados do site aqui. Clique em salvar quando estiver pronto.
          </Dialog.Description>
        </Dialog.Header>
        <div class="grid grid-cols-1 justify-start gap-7 py-4">
          <Dropzone
            id="dropzone"
            on:drop={(e) => dropHandle(e)}
            on:dragover={(event) => {
              event.preventDefault();
            }}
            on:change={(e) => handleChange(e)}
          >
            <svg
              aria-hidden="true"
              class={`mb-3 mt-10 w-10 h-10 text-gray-400 ${company.length > 0 && image ? "hidden" : "block"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              /></svg
            >
            {#if value.length === 0 && !image}
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Clique para inserir uma imagem</span
                > ou arraste e solte
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-12">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            {:else}
              <div class="my-5">
                <img src={image} class="w-24" alt="logo_pagina" />
              </div>
            {/if}
          </Dropzone>

          <div class="flex flex-col gap-1 justify-start">
            <Label for="name" class=" text-sm">Nome da empresa:</Label>
            <Input
              id="name"
              value={name_company}
              on:change={(e) => (name_company = e.target.value)}
              placeholder="Digite o nome da empresa..."
              class="col-span-3"
            />
          </div>
        </div>
        <Dialog.Footer>
          <Button on:click={updateCompanyData}>
            {#if loading}
              <LoaderCircle class="animate-spin" />
            {:else}
              Salvar
            {/if}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  </div>

  <section class="relative w-full mx-auto m-5">
    {#if company}
      {#each company as c}
        <div class={`flex flex-col gap-10 justify-center items-center mb-10`}>
          <button on:click={() => goto("/")}>
            <img
              src={company[0].logo.length ? c.logo : "/No_Image_Available.jpg"}
              class={`w-28 rounded-full border-4 border-gray-300`}
              alt="logo"
            />
          </button>
        </div>

        {#if c.name_company != ""}
          <h1 class="text-xl text-center font-semibold text-gray-600">
            @{c.name_company}
          </h1>
        {:else}
          <div class="text-center">
            <h1 class="text-md font-semibold text-gray-700">
              Nome da empresa: <span class="font-normal text-gray-500"
                >@"Adicione um nome aqui"</span
              >
            </h1>
          </div>
        {/if}
      {/each}

      <div
        class={`${company.length <= 0 ? "block" : "hidden"} mt-10 text-center`}
      >
        <h1 class="text-md font-semibold text-gray-700">
          Nome da empresa:
          <span class="font-normal text-gray-500">@"Adicione um nome aqui"</span
          >
        </h1>
      </div>
    {/if}
  </section>

  <div class="flex justify-end">
    <Dialog.Root>
      <Dialog.Trigger
        class={`${buttonVariants({ variant: "outline" })} absolute right-20`}
        >Criar novo</Dialog.Trigger
      >
      <Dialog.Content class="sm:max-w-[600px]">
        <Dialog.Header>
          <Dialog.Title>Criar link</Dialog.Title>
          <Dialog.Description>
            Preencha os dados do link aqui. Clique em salvar quando estiver
            pronto.
          </Dialog.Description>
        </Dialog.Header>

        <section class="grid grid-cols-1 gap-10 my-7">
          <a
            {href}
            class="border p-3 w-full rounded-md text-center text-md"
            style={`background-color: ${bg_color}; color: ${color}; border-color: ${border_color}`}
          >
            <p>{title}</p>
          </a>

          <div class="grid grid-cols-1 gap-5">
            <div class="flex flex-col gap-1">
              <label for="title">Título:</label>
              <Input on:change={(e) => title = e.target.value} placeholder="Digite o título do link..." />
            </div>
            
            <div class="flex justify-between">
              <div class="flex flex-col gap-1">
                <label for="bg_color">Cor de fundo:</label>
                <input on:change={(e) => bg_color = e.target.value} type="color" name="bg_color" id="bg_color" />
              </div>
              
              <div class="flex flex-col gap-1">
                <label for="color">Cor do texto:</label>
                <input on:change={(e) => color = e.target.value} type="color" name="color" id="color" />
              </div>
              
              <div class="flex flex-col gap-1">
                <label for="border_color">Cor da borda:</label>
                <input on:change={(e) => border_color = e.target.value} type="color" name="border_color" id="border_color" />
              </div>
            </div>
            
            <div class="flex flex-col gap-1">
              <label for="href"> Url:</label>
              <Input placeholder="Digite url do link..." />
            </div>
          </div>
        </section>

        <Dialog.Footer>
          <Button on:click={updateCompanyData}>
            {#if loading}
              <LoaderCircle class="animate-spin" />
            {:else}
              Salvar
            {/if}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  </div>

  <section class="grid grid-rows-4 gap-5 mt-5 w-full">
    {#each lists as list}
      <a
        href={list.href}
        class={`border p-5 w-full rounded-md text-center`}
        style={`background-color: ${list.bg_color}; border-color: ${list.border_color}`}
        target="_blank"
      >
        <p style={`color: ${list.color}`}>{list.title}</p>
      </a>
    {/each}
  </section>
</main>
