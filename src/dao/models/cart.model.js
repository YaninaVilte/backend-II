import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    productos: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "productos",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
    }]
})

cartSchema.pre("findOne", function (next) {
    this.populate("productos.product", "_id title price");
    next();
});


const CartModel = mongoose.model("carritos", cartSchema);

export default CartModel;