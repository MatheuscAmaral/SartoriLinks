<script lang="ts">
  import { storage } from "./../fb.js";
  import db from "../fb";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import toast, { Toaster } from "svelte-french-toast";
  import { Trash2, Pencil, Loader, X, LoaderCircle, CircleArrowLeft, LogOut } from "lucide-svelte";
  import {
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
  } from "firebase/firestore";
  import { Dropzone } from "flowbite-svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Modal } from "flowbite-svelte";

  let defaultModal = false;
  let defaultModal2 = false;
  interface ListsProps {
    id: string;
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
  let loadDelete = false;
  let name_company = "";
  let edit = false;
  let image: string = "";
  let value: File | null = null;
  let lists: ListsProps[] = [];
  let company: CompanyProps[] = [];
  let listId: string = "";
  let usuario: string = "";

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
  };

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;

    if (target && target.files) {
      const file = target.files[0];

      if (file) {
        image = URL.createObjectURL(file);
        value = file;
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
      lists = listsDb.docs.map(
        (list) => ({ ...list.data(), id: list.id }) as ListsProps
      );
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
    title = "";
  };

  const openModalEdit = (list: ListsProps) => {
    listId = list.id;
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
  };

  onMount(() => {
    getData();
  });

  const updateCompanyData = async () => {
    try {
      if (!value) {
        toast.error("Nenhuma imagem selecionada!", {
          position: "top-right",
        });

        return;
      }

      loading = true;

      const storageRef = ref(
        storage,
        "gs://sartorilinks.appspot.com/images/" + value.name
      );

      await uploadBytes(storageRef, value);

      const imageUrl = await getDownloadURL(storageRef);

      image = imageUrl;

      const data = {
        name_company: name_company,
        logo: imageUrl,
      };

      await updateDoc(companyDoc, data);
      defaultModal2 = false;
      
      toast.success("Dados da empresa editados com sucesso!", {
        position: "top-right",
      });
      getData();
    } catch {
      toast.error("Ocorreu um erro ao editar os dados da empresa!", {
        position: "top-right",
      });
    } finally {
      loading = false;
    }
  };

  const updateFormData = (e: Event, type: string) => {
    const target = e.target as HTMLInputElement;

    if (target) {
      if (type == "title") {
        title = target.value;
      }

      if (type == "bg_color") {
        bg_color = target.value;
      }

      if (type == "color") {
        color = target.value;
      }

      if (type == "href") {
        href = target.value;
      }

      if (type == "border_color") {
        border_color = target.value;
      }
    }
  };

  const deleteLink = (list: ListsProps) => {
    try {
      loadDelete = true;
      deleteDoc(doc(db, "lists", list.id));
      toast.success(`${list.title} deletado com sucesso!`, {
        position: "top-right",
      });
      getData();
    } catch {
      toast.error("Ocorreu um erro ao deletar o link!");
    } finally {
      loadDelete = false;
    }
  };

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
        const listDoc = doc(db, "lists", listId);
        await updateDoc(listDoc, data);
      } else {
        await setDoc(doc(db, "lists", title), data);
      }

      getData();
      defaultModal = false;
      toast.success(
        `Link ${edit ? `${listId} editado` : "criado"} com sucesso!`,
        {
          position: "top-right",
        }
      );
    } catch {
      toast.error(`Ocorreu um erro ao ${edit ? "editar" : "criar"} o link!`, {
        position: "top-right",
      });
    } finally {
      loading = false;
    }
  };


  onMount(() => {
      const auth = getAuth();

      onAuthStateChanged(auth, (user) => {
          if(user) {
              console.log("Usuário logado!");
              usuario = String(user.email);
          } else {
              console.log("Usuário não encontrado");
              goto("/login");
          }
      })
  });
</script>

<main class="mx-5 lg:mx-auto lg:max-w-4xl grid grid-cols-1 gap-10 mb-20 mt-10">
  {#if loading}
  <div class="flex justify-center mt-32">
    <Loader class="animate-spin" />
  </div>
  {:else}
  <div>
      <div>
        <button class="absolute left-10" on:click={() => goto("/")}>
          <CircleArrowLeft />
        </button>

        <div class="flex justify-center gap-2 absolute right-12 text-sm">
          <p>{usuario}</p>
          <button on:click>
            <LogOut />
          </button>
        </div>
      </div>
      <div class="flex justify-center">
        <Modal title={"Editar dados da empresa"} bind:open={defaultModal2}>
          <form
            on:submit={updateCompanyData}
            class="grid grid-cols-1 justify-start gap-7 py-4"
          >
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
              {#if !value && !image}
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold"
                    >Clique para inserir uma imagem</span
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

            <section class="border-t w-full pt-5">
              <Button
                type="submit"
                class="bg-white border border-gray-200 text-black hover:bg-gray-100"
              >
                {#if loading}
                  <LoaderCircle class="animate-spin" font-size={12} />
                {:else}
                  Salvar
                {/if}
              </Button>
              <Button
                on:click={() => (defaultModal2 = false)}
                color="alternative"
                class="bg-white border border-gray-200 text-black hover:bg-gray-100"
                >Fechar</Button
              >
            </section>
          </form>
        </Modal>
      </div>

      <section class="relative w-full mx-auto m-5">
        {#if company}
          {#each company as c}
            <div
              class={`flex flex-col gap-10 justify-center items-center mb-10 relative`}
            >
              <img
                src={company[0].logo.length ? c.logo : "/No_Image_Available.jpg"}
                class={`w-24 rounded-full border-4 border-gray-300`}
                alt="logo"
              />

              <button
                on:click={() => (defaultModal2 = true)}
                class="bg-gray-800 text-white p-1.5 rounded-full absolute top-16 ml-14"
              >
                <Pencil />
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

          <div
            class={`${company.length <= 0 ? "block" : "hidden"}  text-center`}
          >
            <h1 class="text-md font-semibold text-gray-700">
              Nome da empresa:
              <span class="font-normal text-gray-500"
                >@"Adicione um nome aqui"</span
              >
            </h1>
          </div>
        {/if}
      </section>

      <div class="flex justify-end">
        <Button
          on:click={() => openModal()}
          class="w-20 bg-white border border-gray-200 text-black hover:bg-gray-100"
          >Criar</Button
        >
      </div>

      <section
        class="grid grid-cols-1 gap-5 mt-5 w-full overflow-y-auto max-h-96"
      >
        {#each lists as list}
          <button
            class={`border p-5 w-full rounded-md text-center relative`}
            style={`background-color: ${list.bg_color}; border-color: ${list.border_color}`}
          >
            <p style={`color: ${list.color}`}>{list.title}</p>

            <div
              class="absolute right-5 top-4 mt-0.5 justify-center flex gap-2"
            >
              <button
                on:click={() => openModalEdit(list)}
                class="bg-gray-800 p-1 rounded-sm text-white"
              >
                <Pencil />
              </button>

              <button
                on:click={() => deleteLink(list)}
                class="bg-gray-800 p-1 rounded-sm text-white"
              >
                {#if loadDelete}
                  <Loader/>
                  {:else}
                    <Trash2 />
                {/if}
              </button>
            </div>
          </button>
        {/each}
      </section>

      <Modal
        title={edit ? "Editar link" : "Criar link"}
        bind:open={defaultModal}
      >
        <form on:submit={saveLink}>
          <section class="grid grid-cols-1 gap-10 my-7 mb-5">
            <a
              {href}
              class="border p-3 w-full rounded-md text-center text-md"
              style={`background-color: ${bg_color}; color: ${color}; border-color: ${border_color}`}
              target="_blank"
            >
              <p>{title != "" ? title : "Digite o título do link"}</p>
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

          <button on:click={() => closeModal()}>
            <X class="absolute right-7 top-7 bg-white" />
          </button>

          <section class="border-t w-full pt-5">
            <Button
              type="submit"
              class="bg-white border border-gray-200 text-black hover:bg-gray-100"
            >
              {#if loading}
                <LoaderCircle class="animate-spin" font-size={12} />
              {:else}
                Salvar
              {/if}
            </Button>
            <Button
              on:click={closeModal}
              color="alternative"
              class="bg-white border border-gray-200 text-black hover:bg-gray-100"
              >Fechar</Button
            >
          </section>
        </form>
      </Modal>
    </div>
  {/if}
  <Toaster />
</main>
