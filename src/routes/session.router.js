import { Router } from "express"
import userModel from "../models/user.model.js"
import { createHash,isValidPassword } from "../util/util.js"
import jwt from  'jsonwebtoken'

const userRouter = Router()

userRouter.post("/register", async (req,res) => {
    const { email, password, first_name, last_name, age} = req.body
    try {
        const existsUser = await userModel.findOne(email)
        if (existsUser) {
            return res.status(400).send('Exists one user with this email')
        }
        const newUser = new userModel(
            {
                email,
                password: createHash(password),
                first_name,
                last_name,
                age
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

        //res.redirect("api/sessions/current")

    } catch (error) {
        res.status(500).send("Internal Server Error")
    }

})

export default userRouter