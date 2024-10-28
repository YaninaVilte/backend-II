// const rol = document.getElementById("rol").textContent;
// const email = document.getElementById("email").textContent;
// const socket = io();

// socket.emit('message', "Comunicación desde websocket");

//     socket.on("productos", (data) => {
//         renderProductos(data);
//     })
//     const renderProductos = (productos) => {
//     const contenedorProductos = document.getElementById("contenedorProductos");

//     contenedorProductos.innerHTML = "";

//     productos.docs.forEach(item => {
//         const card = document.createElement("div");
//         card.classList.add("card");

//         card.innerHTML = ` 
//                         <p> ${item.title} </p>
//                         <p> ${item.price} </p>
//                         <button> Eliminar </button>
//                         `;

//         contenedorProductos.appendChild(card);
//         card.querySelector("button").addEventListener("click", () => {
//             if (rol === "admin" ) {
//                 eliminarProducto(item._id);
//             } else if (rol === "admin") {
//                 eliminarProducto(item._id);
//             } else {
//                 Swal.fire({
//                     title: "Error",
//                     text: "No tenes permiso para borrar ese producto",
//                 })
//             }
//         });
//     })
// }

// const eliminarProducto = (id) => {
//     socket.emit("eliminarProducto", id);
// }

// document.getElementById("btnEnviar").addEventListener("click", () => {
//     addProducts();
// })


// const addProducts = () => {
//     const rol = document.getElementById("rol").textContent;
//     const email = document.getElementById("email").textContent;

//     const owner = rol === "admin" ? email : "admin";
//     const producto = {
//     title: document.getElementById('title').value,
//     description: document.getElementById('description').value,
//     category: document.getElementById('category').value,
//     code: document.getElementById('code').value,
//     img: document.getElementById("img").value,
//     price: document.getElementById('price').value,
//     stock: document.getElementById('stock').value,
//     status: document.getElementById("status").value === "true"
//     };

//     socket.emit("addProducts", producto);
// }
