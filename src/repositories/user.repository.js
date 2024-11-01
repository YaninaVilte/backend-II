import userDao from "../dao/user.dao.js";

class UserRepository {
    async createUser(userData) {
        return await userDao.save(userData);
    }

    async getUserById(id) {
        return await userDao.findById(id);
    }

    async getUserByEmail(email) {
        return await userDao.findOne({email}); 
    }

    async updateUser(id, updateData) {
        return await userDao.update(id, updateData, { new: true });
    }

    async deleteUser(id) {
        return await userDao.delete(id);
    }
}

export default new UserRepository(); 