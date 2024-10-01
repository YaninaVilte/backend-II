const socket = io();

socket.emit('message', "Comunicación desde websocket");

socket.on("products", (data) => {

    const productsList = document.getElementById("productsList");

    productsList.innerHTML = '';

    data.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        productElement.innerHTML = `
            <p>Nombre: ${product.title}</p>
            <p>Categoría: ${product.category}</p>
            <p>Descripción: ${product.description}</p>
            <p>Precio:$ ${product.price}</p>
            <button class="delete-button" data-id="${product.id}">Eliminar</button>
        `;

        productsList.appendChild(productElement);
    });

    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            socket.emit("deleteProduct", productId);
        });
    });
});

const form = document.getElementById("form")

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const code = document.getElementById('code').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;

    if (e) {

        socket.emit('productForm', {
            title,
            description,
            category,
            code,
            price,
            stock
        });
        console.log("enviado al socket")
    }

    document.getElementById('title').value = '';
    document.getElementById('category').value = '';
    document.getElementById('description').value = '';
    document.getElementById('code').value = '';
    document.getElementById('price').value = '';
    document.getElementById('stock').value = '';
});