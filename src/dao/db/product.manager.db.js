import { query } from 'express'
import ProductModel from '../../models/product.model.js'

class ProductManager {

    addProduct = async (product) => {
        try {

            const productExist = await ProductModel.findOne({code: product.code})
            if ( productExist) {
                throw "Error: The value of the Code field must be unique!"
            }
            const newProduct =  new ProductModel( {
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnails: product.thumbnails,
                code: product.code,
                stock: product.stock,
                status: product.status,
                category: product.category
            })

            await newProduct.save()  

        } catch (error) {
              throw `Internal Server Error when trying to add product: ${error}`
        }
    }  


    getProducts = async(query, options)  => {
        try {
            const productsArray = await ProductModel.paginate(query, options)
            return productsArray
        }
         catch (error) {
            throw `Error while fetching products: ${error}`
        }
     }

    getProductById = async (id) => {
        try {
            const productFind = await ProductModel.findById(id)
            console.log(productFind)
            if (productFind){
                return productFind
            } else {
                throw "Product not found."
            }
        } catch (error) {
            throw `Error while fetching product by ID: ${error}`
        }
    }

    updateProduct= async (id,productChange) => {
        try {
            const updateProduct = await ProductModel.findByIdAndUpdate(id,productChange)
            if (!updateProduct) {
                throw 'Product not found.'
                return null
            } else {
                return updateProduct
            }
        } catch (error) {
            throw `Error while updating product: ${error}`
        }
    }

    deleteProduct = async (pid) => {
        try {
            const deleteOk = await ProductModel.findByIdAndDelete(pid)
            if (!deleteOk) {
                throw 'Product not found.'
            } else {
                return `Product with id ${pid} has been successfully removed.`
            }
        } catch (error) {
            throw `Error while deleting product: ${error}`
        }
    }
   
}

export default  ProductManager 

