document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const idProducto = params.get('id');
    let productoActual = null;

    if (!idProducto) {
        window.location.href = "/index.html";
        return;
    }

    const formato = new Intl.NumberFormat("es-CO", {
        style: "currency", currency: "COP", maximumFractionDigits: 0
    });

    const cargarDatos = async () => {
        try {
            const res = await fetch(`/productos/${idProducto}`);
            if (!res.ok) throw new Error("Producto no encontrado");
            productoActual = await res.json();

            document.getElementById('txtNombre').innerText = productoActual.nombre;
            document.getElementById('txtDescripcion').innerText = productoActual.descripcion;
            document.getElementById('txtStock').innerText = productoActual.stock;
            document.getElementById('txtCategoria').innerText = `Categoría ${productoActual.id_categoria}`;
            document.getElementById('imgPrincipal').src = productoActual.imagen || '/imagenes/default.jpg';

            document.getElementById('txtPrecio').innerHTML = `${formato.format(productoActual.precio)} <span>COP</span>`;
            document.getElementById('txtSubtotal').innerText = formato.format(productoActual.precio);
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Producto no encontrado' })
                .then(() => window.location.href = "/index.html");
        }
    };

    const inputCant = document.getElementById('inputCant');
    const txtSubtotal = document.getElementById('txtSubtotal');

    const actualizarSubtotal = () => {
        if (!productoActual) return;
        const total = productoActual.precio * parseInt(inputCant.value);
        txtSubtotal.innerText = formato.format(total);
    };

    document.getElementById('btnMas')?.addEventListener('click', () => {
        inputCant.value = parseInt(inputCant.value) + 1;
        actualizarSubtotal();
    });

    document.getElementById('btnMenos')?.addEventListener('click', () => {
        if (parseInt(inputCant.value) > 1) {
            inputCant.value = parseInt(inputCant.value) - 1;
            actualizarSubtotal();
        }
    });

    const btnAgregar = document.querySelector('.btn-cart-outline');
    if (btnAgregar) {
        btnAgregar.onclick = () => {
            if (!productoActual) return;
            const cantidadSeleccionada = parseInt(inputCant.value);
            let carrito = JSON.parse(localStorage.getItem('carrito_agro')) || [];
            const indice = carrito.findIndex(item => item.id === productoActual.id);

            if (indice !== -1) { carrito[indice].cantidad += cantidadSeleccionada; }
            else {
                carrito.push({
                    id: productoActual.id, nombre: productoActual.nombre,
                    precio: productoActual.precio, cantidad: cantidadSeleccionada,
                    imagen: productoActual.imagen
                });
            }

            localStorage.setItem('carrito_agro', JSON.stringify(carrito));
            Swal.fire({
                title: '¡Añadido!', text: productoActual.nombre,
                icon: 'success', timer: 2000, toast: true, position: 'top-end'
            });
        };
    }
    cargarDatos();
});