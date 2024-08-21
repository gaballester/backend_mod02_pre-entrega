import { Router } from 'express'
import userModel from '../models/user.model.js'

const usersRouter = Router()

// return all users
usersRouter.get('/', async (req,res) => {
    try {
        const result = await userModel.find()
        res.send({
            status: 'success',
            payload: result}) 
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: error.message
        })
    }
})

// crewate a user
usersRouter.post('/', async (req,res) => {
    const {name, age,email} = req.body
    try {
        const result = await userModel.create({name,age,email})
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })
    }
})

// update user properties
usersRouter.put('/:uid', async (req,res) => {
    const uid = req.params.uid
    const { name, age, email } = req.body
    try {
        const user = await userModel.findOne({_id: uid})
        if (!user) throw new Error('User not found')
        
        const updateValues = {
            name: name ?? user.name,
            age: age ?? user.age,
            email: email ?? user.email
        }

        const updateUser = await userModel.updateOne({_id:uid, updateValues})
        res.send({
            status: 'success',
            payload: updateUser
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        })       
    }
})

// drop specified user
usersRouter.delete('/uid', async (req,res) =>{
    const uid = req.params.uid
    try {
        const result = await userModel.deleteOne({_id : uid})
        res.status(200).send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(400).send({
            ststus: 'error',
            message: error.message
        })
    }
})

export default usersRouter