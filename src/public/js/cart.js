function deleteProductFromCart(cartId, productId) {
    console.log('cartId:', cartId, 'productId:', productId); // Agrega esto para depurar
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el producto del carrito');
            }
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


    function vaciarCarrito(cartId) {
        fetch(`/api/carts/${cartId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al vaciar el carrito');
                }
                location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }