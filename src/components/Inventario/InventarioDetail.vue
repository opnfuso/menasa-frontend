<template>
  <main class="flex flex-col pt-6 pb-12 pr-12 pl-12">
    <h1 class="text-3xl font-bold mb-8">Inventario</h1>
    <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
      <h2 class="text-2xl font-semibold mb-4">Medicamento</h2>
      <div class="mb-4 grid grid-cols-1 gap-4">
        <div class="flex flex-col">
          <label class="mb-2 font-semibold">Nombre</label>
          <input
            type="text"
            class="input w-full"
            value="BIOMICS 400MG. C/6 CAPSULAS"
          />
        </div>
        <div class="flex flex-col">
          <label class="mb-2 font-semibold">Codigo de barras</label>
          <input type="number" class="input w-full" value="7501314701322" />
        </div>
        <div class="flex flex-col">
          <label class="mb-2 font-semibold">Precio</label>
          <input
            type="number"
            placeholder="Type here"
            class="input w-full"
            value="618"
          />
        </div>
      </div>
    </div>
    <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
      <h2 class="text-2xl font-semibold mb-4">Información</h2>
      <div class="mb-4 grid grid-cols-1 gap-4">
        <div class="flex flex-col">
          <label class="mb-2 font-semibold">Piezas</label>
          <input type="number" class="input w-full" value="10" />
        </div>
      </div>
    </div>
    <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
      <div>
        <h2 class="text-2xl font-semibold mb-4">Lotes</h2>
        <h3 class="text-xl mb-4 font-semibold">Lote : 377869</h3>
        <div class="mb-4 grid grid-cols-1 gap-4">
          <div class="flex flex-col">
            <label for="date" class="mb-2 font-semibold"
              >Fecha de vencimiento</label
            >
            <input type="date" class="input w-full" value="2022-08-17" />
          </div>
          <div class="flex flex-col">
            <label for="text" class="mb-2 font-semibold"
              >Cantidad de medicamento</label
            >
            <input type="number" class="input w-full" value="5" />
          </div>
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Observaciones</label>
            <textarea class="textarea textarea-bordered">NA</textarea>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div>
        <h3 class="text-xl font-semibold mb-4">Lote : 377867</h3>
        <div class="mb-4 grid grid-cols-1 gap-4">
          <div class="flex flex-col">
            <label for="date" class="mb-2 font-semibold"
              >Fecha de vencimiento</label
            >
            <input type="date" class="input w-full" value="2022-08-17" />
          </div>
          <div class="flex flex-col">
            <label for="text" class="mb-2 font-semibold"
              >Cantidad de medicamento</label
            >
            <input type="number" class="input w-full" value="5" />
          </div>
          <div class="flex flex-col">
            <label class="mb-2 font-semibold">Observaciones</label>
            <textarea class="textarea textarea-bordered">NA</textarea>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
