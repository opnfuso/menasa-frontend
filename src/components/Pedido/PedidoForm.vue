<template>
  <main class="flex flex-col pt-6 pb-12 pr-12 pl-12">
    <form>
      <div class="grid grid-cols-7 gap-4">
        <h1 class="col-span-3 text-3xl font-bold mb-8">Pedido</h1>
        <button class="col-span-2 btn btn-success min-w-fit">Crear</button>
        <div class="col-span-2 btn btn-error min-w-fit">Limpiar</div>
      </div>
      <!-- Información -->
      <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
        <h2 class="text-2xl font-semibold mb-4">Información</h2>
        <div class="mb-4 grid grid-cols-1 gap-4">
          <div class="flex flex-col">
            <label for="text" class="mb-2 font-semibold">Cliente</label>
            <input type="text" class="input w-full" required />
          </div>
          <div class="flex flex-col">
            <label for="date" class="mb-2 font-semibold"
              >Fecha de entrada</label
            >
            <input type="date" class="input w-full" required />
          </div>
          <div class="flex flex-col">
            <label for="date" class="mb-2 font-semibold">Fecha de salida</label>
            <input type="date" class="input w-full" required />
          </div>
          <div class="flex flex-col">
            <label for="checkbox" class="mb-2 font-semibold">Completado</label>
            <input type="checkbox" class="checkbox checkbox-lg" />
          </div>
        </div>
      </div>
      <!-- Contenido -->
      <div class="w-full rounded-xl bg-base-300 p-4 mb-8 shadow-2xl/40">
        <h2 class="text-2xl font-semibold mb-4">Contenido</h2>
        <div class="btn btn-info w-full">Añadir</div>
        <div class="divider"></div>
        <div>
          <h3 class="text-xl mb-4 font-semibold">Contenido</h3>
          <div class="mb-4 grid grid-cols-1 gap-4">
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Piezas</label>
              <input type="number" class="input w-full" required />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Precio maximo</label>
              <input type="number" class="input w-full" required />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Precio sugerido</label>
              <input type="number" class="input w-full" required />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Descuento</label>
              <input type="number" class="input w-full" required />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Precio total</label>
              <input type="number" class="input w-full" />
            </div>
            <div class="flex flex-col">
              <label class="mb-2 font-semibold">Inventario</label>
              <input type="text" class="input w-full" />
            </div>
            <div class="btn btn-error w-full">Eliminar</div>
          </div>
          <div class="divider"></div>
        </div>
      </div>
    </form>
  </main>
</template>
