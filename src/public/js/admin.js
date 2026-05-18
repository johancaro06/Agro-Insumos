const API = "/productos";

const tabla = document.getElementById("tablaProductos");
const form = document.getElementById("formProducto");
const imagenInput = document.getElementById("imagen");
const preview = document.getElementById("preview");
const btnSubmit = document.getElementById("btnSubmit");


const modal = document.getElementById("customModal");
const btnConfirm = document.getElementById("btnConfirm");
const btnCancel = document.getElementById("btnCancel");
let productoAEliminar = null;

function mostrarMensaje(mensaje, tipo = "success") {
    let area = document.getElementById("notification-area");
    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    const icono = tipo === "success" ? "✅" : "❌";
    toast.innerHTML = `<span>${icono} ${mensaje}</span>`;

    area.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

/* =========================
   LISTAR PRODUCTOS
========================= */
const cargarProductos = async () => {
    try {
        const respuesta = await fetch(API);
        const productos = await respuesta.json();
        tabla.innerHTML = "";

        productos.forEach(p => {
            tabla.innerHTML += `
            <article class="product-card">
                <div class="image-container">
                    <img src="${p.imagen || '/imagenes/default.jpg'}" alt="${p.nombre}">
                </div>
                <div class="product-info">
                    <h3>${p.nombre}</h3>
                    <p>${p.descripcion}</p>
                    <p class="price">$${Number(p.precio).toLocaleString("es-CO")}</p>
                    <div class="card-buttons">
                        <button class="btn-edit" onclick='prepararEdicion(${JSON.stringify(p)})'>Editar</button>
                        <button class="btn-delete" onclick='abrirModalEliminar(${p.id})'>Eliminar</button>
                    </div>
                </div>
            </article>`;
        });
    } catch (error) {
        mostrarMensaje("No se pudo cargar el inventario", "error");
    }
};

/* =========================
   GUARDAR / ACTUALIZAR
========================= */
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("id").value;
    btnSubmit.disabled = true;
    btnSubmit.innerText = "Procesando...";

    const formData = new FormData();
    formData.append("nombre", document.getElementById("nombre").value);
    formData.append("descripcion", document.getElementById("descripcion").value);
    formData.append("precio", document.getElementById("precio").value);
    formData.append("stock", document.getElementById("stock").value);
    formData.append("id_categoria", document.getElementById("categoria").value);

    if (imagenInput.files[0]) {
        formData.append("imagen", imagenInput.files[0]);
    } else {
        formData.append("imagenAntigua", preview.getAttribute("src"));
    }

    try {
        const res = await fetch(id ? `${API}/${id}` : API, {
            method: id ? "PUT" : "POST",
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            mostrarMensaje(data.mensaje || "¡Guardado con éxito!");
            limpiarFormulario();
            cargarProductos();
        }
    } catch (e) {
        mostrarMensaje("Error al intentar guardar", "error");
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerText = id ? "🔄 Actualizar Producto" : "✨ Guardar Producto";
    }
});

/* =========================
   EDICIÓN Y ELIMINACIÓN
========================= */
window.prepararEdicion = (p) => {
    document.getElementById("id").value = p.id;
    document.getElementById("nombre").value = p.nombre;
    document.getElementById("descripcion").value = p.descripcion;
    document.getElementById("precio").value = p.precio;
    document.getElementById("stock").value = p.stock;
    document.getElementById("categoria").value = p.id_categoria;

    preview.src = p.imagen || '/imagenes/default.jpg';
    preview.style.display = "block";
    btnSubmit.innerText = "🔄 Actualizar Producto";
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// Lógica del Modal
window.abrirModalEliminar = (id) => {
    productoAEliminar = id;
    modal.style.display = "flex";
};

btnCancel.onclick = () => {
    modal.style.display = "none";
    productoAEliminar = null;
};

btnConfirm.onclick = async () => {
    if (!productoAEliminar) return;
    try {
        const res = await fetch(`${API}/${productoAEliminar}`, { method: "DELETE" });
        if (res.ok) {
            mostrarMensaje("Producto eliminado del inventario");
            cargarProductos();
        }
    } catch (e) {
        mostrarMensaje("No se pudo eliminar", "error");
    } finally {
        modal.style.display = "none";
        productoAEliminar = null;
    }
};

/* =========================
   UTILIDADES
========================= */
imagenInput.onchange = () => {
    const file = imagenInput.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
};

function limpiarFormulario() {
    form.reset();
    document.getElementById("id").value = "";
    preview.style.display = "none";
    preview.src = "";
    btnSubmit.innerText = "✨ Guardar Producto";
}


cargarProductos();