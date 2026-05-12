// 1. Capturar el ID de la URL
const params = new URLSearchParams(window.location.search);
const idProducto = params.get('id');

// 2. Referencias al DOM (Asegúrate de que estos IDs existan en tu HTML)
const txtNombre = document.getElementById('txtNombre');
const txtPrecio = document.getElementById('txtPrecio');
const txtDescripcion = document.getElementById('txtDescripcion');
const txtStock = document.getElementById('txtStock');
const txtCategoria = document.getElementById('txtCategoria');
const imgPrincipal = document.getElementById('imgPrincipal');
const txtSubtotal = document.getElementById('txtSubtotal');
const inputCant = document.getElementById('inputCant');

let precioBase = 0;

const cargarDatos = async () => {
    // Si no hay ID, mandamos al catálogo
    if (!idProducto) {
        console.error("No se encontró el ID en la URL");
        return;
    }

    try {
        console.log("Buscando producto con ID:", idProducto);
        const res = await fetch(`http://localhost:3000/productos/${idProducto}`);

        if (!res.ok) throw new Error("Producto no encontrado en el servidor");

        const p = await res.json();
        console.log("Datos recibidos:", p);

        precioBase = p.precio;

        // 3. Inyectar los datos reales
        txtNombre.innerText = p.nombre;
        txtDescripcion.innerText = p.descripcion;
        txtStock.innerText = `${p.stock} disponibles`;
        txtCategoria.innerText = `Categoría ${p.id_categoria}`;

        imgPrincipal.src = p.imagen || '/imagenes/default.jpg';

        const formatoMoneda = new Intl.NumberFormat("es-CO", {
            style: "currency", currency: "COP", maximumFractionDigits: 0
        });

        txtPrecio.innerHTML = `${formatoMoneda.format(p.precio)} <span>COP</span>`;
        txtSubtotal.innerText = formatoMoneda.format(p.precio);

    } catch (error) {
        console.error("Error cargando detalle:", error);
        txtNombre.innerText = "Error al cargar el producto";
    }
};


document.getElementById('btnMas')?.addEventListener('click', () => {
    inputCant.value = parseInt(inputCant.value) + 1;
    actualizarPrecio();
});

document.getElementById('btnMenos')?.addEventListener('click', () => {
    if (inputCant.value > 1) {
        inputCant.value = parseInt(inputCant.value) - 1;
        actualizarPrecio();
    }
});

function actualizarPrecio() {
    const total = precioBase * inputCant.value;
    txtSubtotal.innerText = new Intl.NumberFormat("es-CO", {
        style: "currency", currency: "COP", maximumFractionDigits: 0
    }).format(total);
}


document.addEventListener('DOMContentLoaded', cargarDatos);