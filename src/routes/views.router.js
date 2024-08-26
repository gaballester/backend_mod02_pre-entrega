 import { Router } from 'express'

export const viewsRouter = Router()

viewsRouter.get("/login",(req,res) => {
    res.render("login")
})

viewsRouter.get("/register",(req,res) => {
    res.render("register")
})

viewsRouter.get("/current",(req,res) => {
    res.render("current")
})

viewsRouter.get("/realtimeproducts", async (req,res) => {
    res.render('realtimeproducts')
}
)

import ProductManager from '../dao/db/product.manager.db.js'

const productManager = new ProductManager()

viewsRouter.get("/", async (req, res) => {
    try {
        const page  = 1
        const limit  = 10
        const sort = {}
        const options = {page, limit, sort}
        let query = {}

        const productsResult = await productManager.getProducts(query,sort); 
        
        const arrayProducts = productsResult.docs.map( prod => {
            const {_id,...rest} = prod.toObject()
            return rest
        })

        res.render( "home", {
            status: 'SUCCESS',
            payloads: arrayProducts,
            prevPage: productsResult.prevPage,
            nextPage: productsResult.nextPage,
            hasPrevPage: productsResult.hasPrevPage,
            hasNextPage: productsResult.hasNextPage,
            prevLink: productsResult.nextLink,
            nextLink: productsResult.prevLink,
            currentPage: productsResult.page,
            totalPages: productsResult.totalPages
        })

        //res.render("home", arrayProducts)
    } catch (error) {
        res.status(500).send("Internal Server Error rendering home hdlb"); 
    }
})

