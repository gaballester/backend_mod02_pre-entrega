import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import passport from 'passport'
import initializePassport from './config/passporta.config.js';
import './database.js'
import { productsRouter } from './routes/products.router.js'
import { cartsRouter } from './routes/carts.router.js'
import { viewsRouter } from './routes/views.router.js'
import sessionRouter from './routes/session.router.js'
import cookieParser from 'cookie-parser'

const PORT = 8080
const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser()); 
app.use(passport.initialize()); 
initializePassport(); 

/* app.use(express.static("./src/public")) */
const __filename = fileURLToPath(import.meta.url);  // get the resolved path to the file
const __dirname = path.dirname(__filename);         // get the name of the directory
app.use('/static', express.static(path.join(__dirname, 'public')))

// express-handlebars
app.engine("handlebars",engine())
app.set("view engine","handlebars")
app.set("views","./src/views")

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)
app.use('/api/sessions',sessionRouter)


const httpServer = app.listen(PORT,() => console.log(`Server listening in port ${PORT}`))

import ProductManager from './dao/db/product.manager.db.js'
const productManager = new ProductManager()

const io = new Server(httpServer)

io.on("connection", async (socket) => {

    console.log('One client connected')

    socket.emit("products", await productManager.getProducts())

    socket.on("dropProduct", async (id) => {           
        try {
            // drop client indicated product
            console.log("main",id)
            await productManager.deleteProduct(id)
            // return all new product lists 
            socket.emit("products", await productManager.getProducts())
        } catch (error) {
            console.error("Drop Product Error:", error);
            // possible client error send
        }
    })

    socket.on("addProduct", async (product) => {
        try {
            console.log(product)
            await productManager.addProduct(product)  
            // return all new product lists 
            socket.emit("products", await productManager.getProducts())
        } catch (error) {
            console.error("Add Product Error:", error);
            // possible client error send           
        }
    })
        
})

