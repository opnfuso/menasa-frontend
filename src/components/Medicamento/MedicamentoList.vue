<template>
  <div class="overflow-x-auto" >
    <h1 class="text-3xl font-bold mb-8">Lista de Precios</h1>
    <table class="table table-compact w-full">
      <thead>
        <tr>
          <th></th>
          <th>Medicamento</th>
          <th>Sal-Compuesto Activo</th>
          <th>Laboratorio</th>
          <th>Codigo de Barras</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>1</th>
          <td>
            <input
              type="text"
              class="input w-full"
              value="BIOMICS 400MG. C/6 CAPSULAS"
            />
          </td>
          <td><input type="text" class="input w-full" value="CEFIXIMA" /></td>
          <td><input type="text" class="input w-full" value="SENOSIAIN" /></td>
          <td>
            <input type="number" class="input w-full" value="7501314701322" />
          </td>
          <td>
            <input
              type="number"
              placeholder="Type here"
              class="input w-full"
              value="618"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
