const API_LOGIN = "/login";

document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;
    const mensajeDiv = document.getElementById("mensaje");

    mensajeDiv.className = "";
    mensajeDiv.innerHTML = "Verificando datos...";
    mensajeDiv.style.display = "block";

    try {
        const respuesta = await fetch(API_LOGIN, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, contrasena })
        });

        const resultado = await respuesta.json();

        if (resultado.acceso) {
            mensajeDiv.innerHTML = `¡Bienvenido ${resultado.nombre}!`;
            mensajeDiv.classList.add("success-msg");


            localStorage.setItem("usuario_agro", JSON.stringify({
                nombre: resultado.nombre,
                rol: resultado.rol,
                id: resultado.id
            }));

            setTimeout(() => {

                if (resultado.rol === "admin") {
                    window.location.href = "/admin.html";
                } else {
                    window.location.href = "/index.html";
                }
            }, 1500);
        } else {
            mensajeDiv.innerHTML = resultado.mensaje || "Credenciales incorrectas";
            mensajeDiv.classList.add("error-msg");
        }
    } catch (error) {
        mensajeDiv.innerHTML = "⚠️ Error de conexión con el servidor";
        mensajeDiv.classList.add("error-msg");
    }
});