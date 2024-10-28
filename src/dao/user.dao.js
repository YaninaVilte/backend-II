import UsersModel from "./models/users.model.js";

class UserDao {
    async findById(id) {
        return await UsersModel.findById(id);
    }

    async findOne(query) {
        return await UsersModel.findOne(query);
    }

    async save(userData) {
        const newUser = new UsersModel(userData);
        return await newUser.save();
    }

    async update(id, userData) {
        return await UsersModel.findByIdAndUpdate(id, userData);
    }

    async delete(id) {
        return await UsersModel.findByIdAndDelete(id);
    }
}

export default new UserDao(); 