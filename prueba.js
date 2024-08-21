import express from 'express';
import mongoose from 'mongoose';
import CartModel from './src/models/cart.model.js';
import ProductModel from './src/models/product.model.js';
import { CartManager } from './src/dao/db/cart.manager.db.js';

const app = express();
const port = process.env.PORT || 8080;

mongoose.connect("mongodb+srv://guillermoaballester:coderhouse@cluster0.qxmm2xi.mongodb.net/ecommerce")
    .then(() => console.log('Connected to ecommerce database'))
    .catch((error) => console.log('Connect error', error));

const cartManager = new CartManager();

const traerCartera = async (req, res) => {
    try {
        // Obtén el ID del carrito desde los parámetros de la URL
        const cartId = req.params.id;
        // Utiliza populate() si necesitas llenar campos referenciados
        const cart = await CartModel.findById(cartId); //.populate('products.product');
        if (!cart) {
            console.log('No se encontró la cartera');
            res.status(404).send('No se encontró la cartera');
        } else {
            console.log(cart);
            res.status(200).json(cart); // Devuelve la cartera como respuesta
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
};

// Definir ruta dinámica para la API
app.get('/api/carts/:id', traerCartera);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
