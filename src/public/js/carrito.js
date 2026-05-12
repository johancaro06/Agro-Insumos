document.addEventListener('DOMContentLoaded', () => {
    const listaProductos = document.getElementById('listaProductos');
    const totalCarrito = document.getElementById('totalCarrito');
    const carritoVacio = document.getElementById('carritoVacio');
    const tablaCarrito = document.getElementById('tablaCarrito');

    const formato = new Intl.NumberFormat("es-CO", {
        style: "currency", currency: "COP", maximumFractionDigits: 0
    });

    function renderizarCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carrito_agro')) || [];
        listaProductos.innerHTML = '';

        if (carrito.length === 0) {
            if(tablaCarrito) tablaCarrito.style.display = 'none';
            if(carritoVacio) carritoVacio.style.display = 'block';
            totalCarrito.innerText = formato.format(0);
            return;
        }

        if(tablaCarrito) tablaCarrito.style.display = 'table';
        if(carritoVacio) carritoVacio.style.display = 'none';

        let totalTotal = 0;
        carrito.forEach((p, index) => {
            const subtotal = p.precio * p.cantidad;
            totalTotal += subtotal;
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><div class="item-info"><span>${p.nombre}</span></div></td>
                <td>${formato.format(p.precio)}</td>
                <td>
                    <div class="qty-controls">
                        <button onclick="cambiarCantidad(${index}, -1)">-</button>
                        <span>${p.cantidad}</span>
                        <button onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                </td>
                <td>${formato.format(subtotal)}</td>
                <td><button class="btn-delete" onclick="eliminarItem(${index})">🗑️</button></td>
            `;
            listaProductos.appendChild(fila);
        });
        totalCarrito.innerText = formato.format(totalTotal);
    }

    window.cambiarCantidad = (index, valor) => {
        let carrito = JSON.parse(localStorage.getItem('carrito_agro'));
        carrito[index].cantidad += valor;
        if (carrito[index].cantidad < 1) carrito[index].cantidad = 1;
        localStorage.setItem('carrito_agro', JSON.stringify(carrito));
        renderizarCarrito();
    };

    window.eliminarItem = (index) => {
        let carrito = JSON.parse(localStorage.getItem('carrito_agro'));
        carrito.splice(index, 1);
        localStorage.setItem('carrito_agro', JSON.stringify(carrito));
        renderizarCarrito();
    };

    document.getElementById('btnFinalizarCompra').onclick = async () => {
        const carrito = JSON.parse(localStorage.getItem('carrito_agro')) || [];
        const usuario = JSON.parse(localStorage.getItem('usuario_agro'));
        if (carrito.length === 0) return;

        const dataVenta = {
            id_transaccion: 'TRX-' + Date.now(),
            id_cliente: usuario ? usuario.id : 'INVITADO',
            email: usuario ? usuario.email : 'anonimo@agro.com',
            total: carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0),
            productos: carrito
        };

        try {
            const res = await fetch('/comprar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataVenta)
            });
            if (res.ok) {
                Swal.fire({ title: '¡Compra Exitosa!', icon: 'success' })
                    .then(() => {
                        localStorage.removeItem('carrito_agro');
                        window.location.href = '/index.html';
                    });
            }
        } catch (e) { Swal.fire('Error', 'No se pudo procesar', 'error'); }
    };
    renderizarCarrito();
});