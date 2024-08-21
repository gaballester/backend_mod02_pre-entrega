import { Router } from 'express';
import { CartManager } from '../dao/db/cart.manager.db.js'

export const cartsRouter = Router()

const cartManager = new CartManager()

// Create New Cart
cartsRouter.post('/', async (req,res) => {
    try {
        console.log('entro pro crear nueva cartera')
        const newCart = await cartManager.addNewCart()
        res.json(newCart)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error -adding new cart"})
    }
})
    
// Get cart by Id
cartsRouter.get('/:id', async (req,res) => {
    const { id } = req.params
    try {
        const cartProducts = await cartManager.getCartById(id)
        res.json(cartProducts)      
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error - error to access to products cart. ${error.message} `})
    }
} )

// add quantityn & product to cartId
cartsRouter.post('/:cid/products/:pid', async (req,res)  => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity || 1
        const cart = await cartManager.addProductToCart(cid,pid,quantity)
        return cart
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error - adding product to Cart.  ${error.message}`})
    }
})

// replace products with multiply products to CartId
cartsRouter.put('/:cid', async (req, res) => {
    const { cid } = req.params
    const products = req.body 
    try {
        const updatedCart = await cartManager.addProductsToCart(cid, products);
        res.status(200).json({ message: "Products added successfully", cart: updatedCart })
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error - ${error.message}` })
    }
})

// empty specified cart
cartsRouter.delete('/:cid', async (req,res) => {
    const {cid} = req.params
    try {
        const response = await cartManager.emptyCart(cid)
        res.status(200).json({message: "Cart successfully deleted"});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - deleting Cart"})
    }
})

// delete specified product from cart
cartsRouter.delete('/:cid/products/:pid', async (req,res) => {
    const { cid , pid } = req.params
    try {
        const cartProducts = await cartManager.dropProductFromCart(cid,pid)
        res.json(cartProducts)      
    } catch (error) {
        res.status(500).json({ error: `Internal Server Error - error to drop a product fromn cart. ${error.message} `})
    }
} )

// Middleware for not defined routes
cartsRouter.use((req, res) => {
    res.status(404).json({ error: "Route Not Found" });
})




