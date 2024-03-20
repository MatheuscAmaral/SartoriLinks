<script lang="ts">
  import db from "../fb";
  import { onMount } from "svelte";
  import { collection, getDocs } from "firebase/firestore";
  import { Dropzone } from "flowbite-svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  let image: string = "";
  let value: string[] = [];
  let lists: ListsProps[] = [];
  let company: CompanyProps[] = [];

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

  onMount(() => {
    const getData = async () => {
      const companyDb = await getDocs(companyCollection);
      company = companyDb.docs.map((c) => ({ ...c.data(), id: c.id }));
      console.log(company);

      const listsDb = await getDocs(listsCollection);
      lists = listsDb.docs.map((list) => ({ ...list.data(), id: list.id }));
    };

    getData();
  });

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
    <div class="">
        <img src="/No_Image_Available.jpg" class="w-32 rounded-full" alt="">
    </div>

    <Dialog.Root>
        <Dialog.Trigger class={`${buttonVariants({ variant: "outline" })} absolute right-20`}
          >Editar</Dialog.Trigger
        >
        <Dialog.Content class="sm:max-w-['250px']">
          <Dialog.Header>
            <Dialog.Title>Editar dados</Dialog.Title>
            <Dialog.Description>
              Edite os dados do site aqui. Clique em salvar quando estiver pronto.
            </Dialog.Description>
          </Dialog.Header>
          <div class="grid grid-cols-1 justify-start gap-4 py-4">
            {#if company.length <= 0}
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
                  class="mb-3 mt-10 w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    class={`${company.length > 0 && image ? "hidden" : "block"}`}
                  /></svg
                >
                {#if value.length === 0}
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">Clique para inserir uma imagem</span
                    > ou arraste e solte
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-12">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                {/if}
              </Dropzone>
            {/if}
    
            <div class="grid grid-cols-4 gap-4 justify-start items-center">
              <Label for="name" class="text-right text-sm">Nome</Label>
              <Input
                id="name"
                value=""
                placeholder="Digite o nome da empresa..."
                class="col-span-3"
              />
            </div>
          </div>
          <Dialog.Footer>
            <Button type="submit">Salvar</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
  </div>

  <section class="relative w-full mx-auto m-5">
    {#if company}
      {#each company as c}
        <div
          class={`${c.logo != "" ? "flex" : "hidden"} justify-center items-center mb-20`}
        >
          <img
            src={c.logo || image}
            class={`absolute top-10 mb-20 w-28 rounded-full`}
            alt="logo"
          />
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

      <div class={`${company.length <= 0} mt-10 text-center`}>
        <h1 class="text-md font-semibold text-gray-700">
          Nome da empresa:
          <span class="font-normal text-gray-500">@"Adicione um nome aqui"</span
          >
        </h1>
      </div>
    {/if}
  </section>

  <section class="grid grid-rows-4 gap-5 mt-5 w-full">
    {#each lists as list}
      <a
        href={list.href}
        class={`border border-gray-200 p-5 w-full rounded-md text-center`}
        style={`background-color: ${list.bg_color}`}
        target="_blank"
      >
        <p style={`color: ${list.color}`}>{list.title}</p>
      </a>
    {/each}
  </section>
</main>
