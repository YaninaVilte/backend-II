const socket = io();
const rol = document.getElementById("rol").textContent;
const email = document.getElementById("email").textContent;

let currentPage = 1;
let limit = 10;

socket.on("productos", (data) => {
    renderProductos(data);
    renderPagination(data);
});

const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    productos.docs.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = ` 
                        <p> ${item.title} </p>
                        <p> ${item.price} </p>
                        <button> Eliminar </button>
                        `;

        contenedorProductos.appendChild(card);
        card.querySelector("button").addEventListener("click", () => {
            if (rol === "admin") {
                deleteProductFromStore(item._id);
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No tienes permiso para borrar este producto",
                });
            }
        });
    });
};

const renderPagination = (data) => {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    if (data.hasPrevPage) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "Anterior";
        prevButton.addEventListener("click", () => {
            fetchPage(data.prevPage);
        });
        paginationContainer.appendChild(prevButton);
    }

    if (data.hasNextPage) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "Siguiente";
        nextButton.addEventListener("click", () => {
            fetchPage(data.nextPage);
        });
        paginationContainer.appendChild(nextButton);
    }
};

const fetchPage = (page) => {
    currentPage = page;
    socket.emit("fetchProducts", { page: currentPage, limit: limit });
};

document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
    addProductToStore();
});

const addProductToStore = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
    };

    console.log("Producto enviado al servidor:", producto);
    socket.emit("addProductToStore", producto);
};


const deleteProductFromStore = (id) => {
    socket.emit("deleteProductFromStore", id);
};
