import mongoose from "mongoose";

mongoose.connect("mongodb+srv://yanivilte:coderhouse@cluster0.jyqtcqx.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Nos conectamos a la BD correctamente"))
    .catch((error) => console.log("Tenemos un error de conexión en la BD", error))