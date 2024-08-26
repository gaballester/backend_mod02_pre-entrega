import { Router } from "express"
import userModel from "../models/user.model.js"
import CartManager  from "../dao/db/cart.manager.db.js"
import { createHash,isValidPassword } from "../util/util.js"
import jwt from  'jsonwebtoken'
import passport from "passport"

const userRouter = Router()
const cartManager = new CartManager()

userRouter.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.email) {
        res.render("current", { email });
    } else {
        res.status(401).send("Not authorized");
    }
});

userRouter.post("/register", async (req,res) => {
    const { email, password, first_name, last_name, age} = req.body
    try {
        const existsUser = await userModel.findOne({email})
        if (existsUser) {
            return res.status(400).send('Exists one user with this email')
        } 
        const newCart = await cartManager.addNewCart()
        const newUser = new userModel(
            {
                email,
                password: createHash(password),
                first_name,
                last_name,
                age,
                cartId: newCart._id
            }
        )
        await newUser.save()
        // create token
        const token = jwt.sign({email: newUser.email, role: newUser.role},"coderhouse",{expiresIn: "1h"})
        // create cookie
        res.cookie("coderCookieToken",token,{
            maxAge: 3600000,
            httpOnly: true 
        })
        res.redirect("/current")

    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
})

userRouter.post("/login",async(req,res) => {
    const {email,password} = req.body
    try {
        const userExists = await userModel.findOne({email})
        if(!userExists) {
            return res.status(401).send("User not Exists")
        }
        if(!isValidPassword(password,userExists)) {
            return res.status(401).send("input data error")
        }
        // create token
        const token = jwt.sign({email: userExists.email, role: userExists.role},"coderhouse",{expiresIn: "1h"})
        // create cookie
        res.cookie("coderCookieToken",token,{
            maxAge: 3600000,
            httpOnly: true 
        })
        //res.render('current', { email });
        res.redirect("/api/sessions/current")

    } catch (error) {
         res.status(401).send("Internal error Server")
    }
})

userRouter.post("/logout", (req,res)=> {
    res.clearCookie("coderCookieToken")
    res.redirect("/api/sessions/login")
})


export default userRouter