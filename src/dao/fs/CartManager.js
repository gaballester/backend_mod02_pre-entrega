import { promises as fs } from "fs";

class CartManager {
  constructor(path) {
    this.carts = [],
    this.path = path
  }

  getCarts = async () => {
    try {
      let cartsArray = await this.readFile()
      return cartsArray
    } catch (error) {
      throw new { error: `Error getting carts: ${error}` }
    }
  }

  
  getCartProducts = async (id) => {
    const carts = await this.getCarts()
    const cart = carts.find((cart) => cart.id === id)
    return cart ? cart.products : "Cart is not available"
  }

  addNewCart = async () => {
    const id = await this.getLastCartId();
    const newCart = { id, products: [] };
    this.carts = await this.getCarts();
    this.carts.push(newCart);
    this.saveFile(this.carts);
    return newCart
  };

  addProducttoCart = async (cartId, productId) => {
    if (!cartId || !productId) {
      throw new Error("Invalid cartId or productId");
    }

    const carts = await this.getCarts();
    const index = carts.findIndex((cart) => cart.id === cartId);

    if (index != -1) {
      const cartProducts = await this.getCartProducts(cartId);
      const prodIndex = cartProducts.findIndex(product => product.productId === productId);
      
      if (prodIndex != -1) {
        cartProducts[prodIndex].quantity += 1
      } else {
        const object = {
            "productId" : productId,
            "quantity" : 1
        } 
        cartProducts.push(object)
      }
     
      carts[index].products = cartProducts

      await this.saveFile(carts)
      console.log("product added to cart")
      
    } else {
      throw new Error("Cart not found")   
    }
  }

  // additional functions ======================================================================
  readFile = async () => {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      // convert JSON array will be parsed into a JavaScript array
      return JSON.parse(response);
    } catch (error) {
      throw { error: `Error reading file ${this.path}: ${error}` }
    }
  }

  saveFile = async (cartArrays) => {
    try {
      await fs.writeFile(this.path, JSON.stringify(cartArrays, null, 2));
      return "carts file saved";
    } catch (error) {
      throw { error: `Error writting file ${this.path}: ${error}` }
    }
  }

  getLastCartId = async () =>{
    const carts = await this.readFile();
    const lastId = carts.length > 0 ? Math.max(...carts.map((cart) => cart.id)) + 1 : 1;
    return lastId;
  }
}
    

export { CartManager };
