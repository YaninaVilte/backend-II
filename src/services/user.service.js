import userRepository from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/util.js";

class UserServices {
    async registerUser(userData) {
        const existingUser = await userRepository.getUserByEmail(userData.email);
        if(existingUser) throw new Error("El usuario ya existe"); 

        const newCart = await cartRepository.createCart();

        userData.password = createHash(userData.password);
        userData.cart = newCart._id;
        
        return await userRepository.createUser(userData); 
    }

    async loginUser(email, password) {
        const user = await userRepository.getUserByEmail(email); 
        if(!user || !isValidPassword(password, user)) throw new Error("Credenciales incorrectas"); 
        return user; 
    }

    async getUserById(id) {
        return await userRepository.getUserById(id); 
    }

    async updateUser(id, updateData) {
        return await userRepository.updateUser(id, updateData);
    }

    async deleteUser(id) {
        return await userRepository.deleteUser(id);
    }
}

export default new UserServices(); 
