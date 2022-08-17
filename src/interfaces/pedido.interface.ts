interface inventario
{
    id: string;
}

interface medicamento
{
    piezas: number;
    precio_maximo: number;
    precio_sugerido: number;
    descuento: number;
    precio_total: number;
    id_inventario: Array<inventario>;
}

export interface pedido
{
    _id: string;
    cliente:string;
    completado: boolean;
    fecha_salida: Date;
    medicamentos: Array<medicamento>
}