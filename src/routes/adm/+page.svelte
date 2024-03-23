<script lang="ts">
  import db from "../fb";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import {
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import { Dropzone } from "flowbite-svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { LoaderCircle } from "lucide-svelte";
  import { Modal } from "flowbite-svelte";
  let defaultModal = false;
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
  let edit = false;
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
    event.preventDefault();
    const dataTransfer = event.dataTransfer;

    if (dataTransfer) {
      const files = dataTransfer.files;

      if (files.length > 0) {
        const file = files[0];

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();

          reader.onload = () => {
            console.log(reader.result);
            image = String(reader.result);
          };

          reader.readAsDataURL(file);
        }
      }
    }
  };
 
  const updateCompanyName = (e: Event) => {
    const target = e.target as HTMLInputElement;

    if (target && target.value) {
      name_company = target.value;
    }
  }

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;

    if (target && target.files) {
      const files = target.files;

      if (files.length > 0) {
        value.push(files[0].name);
        value = value;

        image = URL.createObjectURL(files[0]);
      }
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

  const openModal = () => {
    defaultModal = true;
    href = "";
    border_color = "#d1cdcd";
    color = "#000";
    bg_color = "#fff";
    title = "Digite o título do link";
  };

  const openModalEdit = (list: ListsProps) => {
    defaultModal = true;
    title = list.title;
    href = list.href;
    bg_color = list.bg_color;
    color = list.color;
    border_color = list.border_color;
    edit = true;
  };

  const closeModal = () => {
    defaultModal = false;
    edit = false;
    console.log(edit);
  };

  onMount(() => {
    getData();
  });

  const updateCompanyData = async () => {
    const data = {
      name_company: name_company,
      logo: image,
    };

    await updateDoc(companyDoc, data);

    getData();
  };

  const updateFormData = (e: Event, type: string) => {
    const target = e.target as HTMLInputElement;

    if(target) {
      if(type == "title") {
        title = target.value;
      }

      if(type == "bg_color") {
        bg_color = target.value;
      }

      if(type == "color") {
        color = target.value;
      }

      if(type == "href") {
        href = target.value;
      }

      if(type == "border_color") {
        border_color = target.value;
      }
    }
  }

  const saveLink = async () => {
    loading = true;

    if (!edit && lists.length >= 7) {
      loading = false;
      return toast.error("Você atingiu o limite de 7 links!", {
        position: "top-right",
      });
    }

    const data = {
      bg_color: bg_color,
      color: color,
      title: title,
      border_color: border_color,
      href: href,
    };

    try {
      if (edit) {
        const listDoc = doc(db, "lists", title);
        await updateDoc(listDoc, data);
      } else {
        await setDoc(doc(db, "lists", title), data);
      }

      getData();
      defaultModal = false;
      toast.success("Link criado com sucesso!", {
        position: "top-right",
      });
    } catch {
      toast.error(`Ocorreu um erro ao ${edit ? "editar" : "criar"} o link!`, {
        position: "top-right",
      });
    } finally {
      loading = false;
    }
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

<main class="mx-5 lg:mx-auto lg:max-w-4xl grid grid-cols-1 gap-10 mb-20 mt-10">
  <div class="flex justify-center">
    <Dialog.Root>
      <div class="flex justify-end w-full">
        <Dialog.Trigger class={`${buttonVariants({ variant: "outline" })}`}
          >Editar</Dialog.Trigger
        >
      </div>
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
              on:change={(e) => updateCompanyName(e)}
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
              class={`w-24 rounded-full border-4 border-gray-300`}
              alt="logo"
            />
          </button>
        </div>

        {#if c.name_company != ""}
          <h1 class="text-lg text-center font-semibold text-gray-600">
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

      <div class={`${company.length <= 0 ? "block" : "hidden"}  text-center`}>
        <h1 class="text-md font-semibold text-gray-700">
          Nome da empresa:
          <span class="font-normal text-gray-500">@"Adicione um nome aqui"</span
          >
        </h1>
      </div>
    {/if}
  </section>

  <div class="flex justify-end">
    <Button on:click={() => openModal()} class="w-20">Criar novo</Button>
  </div>

  <section class="grid grid-cols-1 gap-5 mt-5 w-full overflow-y-auto max-h-96">
    {#each lists as list}
      <button
        on:click={() => openModalEdit(list)}
        class={`border p-5 w-full rounded-md text-center`}
        style={`background-color: ${list.bg_color}; border-color: ${list.border_color}`}
      >
        <p style={`color: ${list.color}`}>{list.title}</p>
      </button>
    {/each}
  </section>

  <Modal title={edit ? "Editar link" : "Criar link"} bind:open={defaultModal}>
    <form on:submit={saveLink}>
      <section class="grid grid-cols-1 gap-10 my-7 mb-5">
        <a
          {href}
          class="border p-3 w-full rounded-md text-center text-md"
          style={`background-color: ${bg_color}; color: ${color}; border-color: ${border_color}`}
          target="_blank"
        >
          <p>{title}</p>
        </a>

        <div class="grid grid-cols-1 gap-5">
          <div class="flex flex-col gap-1">
            <label for="title">Título:</label>
            <Input
              on:change={(e) => updateFormData(e, "title")}
              placeholder="Digite o título do link..."
              value={title}
              required
            />
          </div>

          <div class="flex justify-between">
            <div class="flex flex-col gap-1">
              <label for="bg_color">Cor de fundo:</label>
              <input
                on:change={(e) => updateFormData(e, "bg_color")}
                value={bg_color}
                type="color"
                name="bg_color"
                id="bg_color"
                required
              />
            </div>

            <div class="flex flex-col gap-1">
              <label for="color">Cor do texto:</label>
              <input
                on:change={(e) => updateFormData(e, "color")}
                value={color}
                type="color"
                name="color"
                id="color"
                required
              />
            </div>

            <div class="flex flex-col gap-1">
              <label for="border_color">Cor da borda:</label>
              <input
                on:change={(e) => updateFormData(e, "border_color")}
                value={border_color}
                type="color"
                name="border_color"
                id="border_color"
                required
              />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label for="href"> Url:</label>
            <Input
              on:change={(e) => updateFormData(e, "href")}
              placeholder="Digite url do link..."
              value={href}
              required
            />
          </div>
        </div>
      </section>

      <section class="border-t w-full pt-5">
        <Button type="submit">
          {#if loading}
            <LoaderCircle class="animate-spin" />
          {:else}
            Salvar
          {/if}
        </Button>
        <Button on:click={closeModal} color="alternative">Fechar</Button>
      </section>
    </form>
  </Modal>

  <Toaster />
</main>
