import { promises as fs } from 'fs'

class ProductManager {

    constructor(path) {
        this.products = [],
        this.path = path
    }

    addProduct = async (product) => {
        try {
            
            let productsArray = await this.readFile(); 

            if ( !this.isValidObject(product)){
                throw "Error: All fields are required for adding a product!"
            }
            
            if(productsArray.some(item => item.code === product.code)) {
                throw "Error: The value of the Code field must be unique!"
            }

            const currentId = await this.lastProductId(productsArray)

            const newProduct = {
                id : currentId,
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnails: product.thumbnails,
                code: product.code,
                stock: product.stock,
                status: product.status,
                category: product.category
            }
            
            productsArray.push(newProduct)

            await this.saveFile(productsArray)

            return newProduct      

        } catch (error) {
              throw `Internal Server Error when trying to add product: ${error}`
        }
    } 

    getProducts = async() => {
        try {
            let productsArray = await this.readFile(); 
            return productsArray
        } catch (error) {
            throw `Error while fetching products: ${error}`
        }
     }

    getProductById = async (id) => {
        try {
            const productsArray = await this.getProducts()
            const productFind = productsArray.find(prod => prod.id == id)
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
            let productsArray = await this.getProducts() 
            const pos = productsArray.findIndex(prod => prod.id === id)
            if ( pos != -1 ) {
                // I clone the product to modify so as not to touch the origin
                const updateProduct = {...productsArray[pos]}
                // I update only fields that I received
                for (const key in productChange) {
                    if (key !== 'id') {
                        updateProduct[key] = productChange[key]      
                    }
                }
                productsArray[pos] = updateProduct
                await this.saveFile(productsArray);              
                return updateProduct
            } else {
               throw 'Product not found.'
            }
        } catch (error) {
            throw `Error while updating product: ${error}`
        }
    }

    deleteProduct = async (pid) => {
        try {
            let productsArray = await this.readFile(); 
            const pos = productsArray.findIndex(prod => prod.id === pid)
            if ( pos !== -1 ) {
                productsArray.splice(pos,1)
                await this.saveFile(productsArray)
                return `Product with id ${pid} has been successfully removed.`
            }
            else {
                 throw 'Product not found.'
            }
        } catch (error) {
            throw `Error while deleting product: ${error}`
        }
    }
   
    // aux internal metods

    isValidObject = (objeto) => {
        for (let property in objeto) {
            if (objeto[property] === undefined || objeto[property] === null || objeto[property] === '') {
                return false
            }
        }
        return true
    }

    saveFile = async(productsArrays) => {
        try {
            await fs.writeFile(this.path, JSON.stringify(productsArrays, null, 2));
            return `File "${this.path}" saved successfully`
        } catch (error) {
            console.error(`Error saving file "${this.path}":`, error)
            throw error
        }
    }

    readFile = async () => {
        try {
            const response = await fs.readFile(this.path, "utf-8")
            // convert JSON array will be parsed into a JavaScript array
            return JSON.parse(response)
        } catch (error) {
            console.error(`Error reading file "${this.path}":`, error)
            throw error
        }
    }

    lastProductId = async (products) => {
        if (products.length > 0) {
            // Sort the products by ID in descending order and take the first element
            const sortedProducts = products.sort((a, b) => b.id - a.id);
            return sortedProducts[0].id + 1; // Devolver el siguiente ID disponible
        }
        return 1; // if there are no products, return 1 as the first ID
    }

}

export default  ProductManager 

