const API_PROD = "/productos";
let productosGlobal = [];

async function obtenerProductos() {
    try {
        const respuesta = await fetch(API_PROD);
        if (!respuesta.ok) throw new Error("Error en la respuesta del servidor");

        productosGlobal = await respuesta.json();
        mostrarProductos(productosGlobal);
        actualizarUI(); // Sincroniza interfaz y carrito al cargar
    } catch (error) {
        console.error("Error cargando productos:", error);
        const contenedor = document.getElementById("productos");
        if (contenedor) {
            contenedor.innerHTML = `<p style="text-align:center; grid-column: 1/-1;">
                No se pudieron cargar los productos. Verifica que el servidor esté corriendo.
            </p>`;
        }
    }
}
function mostrarProductos(productos) {
    const contenedor = document.getElementById("productos");
    const contador = document.getElementById("contadorProductos");

    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (contador) {
        contador.textContent = `Mostrando ${productos.length} productos para tu campo`;
    }

    productos.forEach(p => {
        const precioCOP = new Intl.NumberFormat('es-CO', {
            style: 'currency', currency: 'COP', maximumFractionDigits: 0
        }).format(p.precio);

        contenedor.innerHTML += `
            <article class="product-card">
                <div class="image-container">
                    <img src="${p.imagen || '/imagenes/default.jpg'}" alt="${p.nombre}">
                </div>
                <div class="product-info">
                    <h3>${p.nombre}</h3>
                    <p class="price">${precioCOP}</p>
                    <div style="display: flex; gap: 8px; flex-direction: column;">
                        <button onclick="agregarRapido(${p.id}, '${p.nombre}', ${p.precio}, '${p.imagen}')" class="btn-add">
                            🛒 Agregar al Carrito
                        </button>
                        <a href="/detalle.html?id=${p.id}" class="btn-detail" style="text-align: center; text-decoration: none;">
                            🔍 Ver Detalle
                        </a>
                    </div>
                </div>
            </article>
        `;
    });
}

window.agregarRapido = (id, nombre, precio, imagen) => {
    let carrito = JSON.parse(localStorage.getItem('carrito_agro')) || [];
    const existe = carrito.find(item => item.id === id);

    if (existe) {
        existe.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1, imagen });
    }

    localStorage.setItem('carrito_agro', JSON.stringify(carrito));
    actualizarContador();

    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Añadido al carrito',
        showConfirmButton: false,
        timer: 1500
    });
};

function actualizarContador() {
    const carrito = JSON.parse(localStorage.getItem('carrito_agro')) || [];
    const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    const badge = document.getElementById("cart-count");
    if (badge) badge.innerText = totalItems;
}

function actualizarUI() {
    const usuario = JSON.parse(localStorage.getItem('usuario_agro'));
    const btnAccount = document.getElementById("userBtn");
    const dropdown = document.getElementById("userDropdown");

    if (usuario && btnAccount) {
        const nombreMostrar = usuario.nombre ? usuario.nombre.split(' ')[0] : 'Usuario';
        btnAccount.innerHTML = `👤 Hola, ${nombreMostrar}`;

        let opcionesExtra = "";
        if (usuario.rol === 'admin') {
            opcionesExtra = `<a href="/admin.html" style="color: #008f4c; font-weight: bold;">⚙️ Panel Admin</a>`;
        }

        dropdown.innerHTML = `
            ${opcionesExtra}
            <a href="/perfil.html">Mi Perfil</a>
            <a href="/pedidos.html">Mis Pedidos</a>
            <hr>
            <a href="#" id="logout">Cerrar Sesión</a>
        `;

        document.getElementById("logout").onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('usuario_agro');
            window.location.reload();
        };
    } else if (btnAccount) {
        btnAccount.innerHTML = `👤 Mi Cuenta`;
        dropdown.innerHTML = `<a href="/login.html">Ingresar / Registro</a>`;
    }
    actualizarContador();
}

const inputBuscar = document.getElementById("buscar");
if (inputBuscar) {
    inputBuscar.addEventListener("input", (e) => {
        const texto = e.target.value.toLowerCase();
        const filtrados = productosGlobal.filter(p =>
            p.nombre.toLowerCase().includes(texto)
        );
        mostrarProductos(filtrados);
    });
}

const btnCartNav = document.querySelector(".btn-cart");
if (btnCartNav) {
    btnCartNav.onclick = () => {
        window.location.href = "/carrito.html";
    };
}

const btnUser = document.getElementById("userBtn");
if (btnUser) {
    btnUser.onclick = (e) => {
        e.stopPropagation();
        const drop = document.getElementById("userDropdown");
        if (drop) drop.classList.toggle("show");
    };
}

window.onclick = () => {
    const drop = document.getElementById("userDropdown");
    if (drop) drop.classList.remove("show");
};


obtenerProductos();