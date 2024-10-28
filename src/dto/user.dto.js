class UserDTO {
    constructor(user) {
        this.email = user.email; 
        this.cartId = user.cart ? user.cart.toString() : null;
        this.rol = user.rol; 
        this.fullName = `${user.first_name} ${user.last_name}`;
    }
}

export default UserDTO; 