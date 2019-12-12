const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const multer = require('multer')
const { newUserEmail , cancelAccount} = require('../emails/account')
const router = new express.Router()

router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e){
        res.status(400).send(e)
    }
})

router.get('/users/me', auth, async (req,res)=>{
    // try{
    //     const users = await User.find({})
    //     res.send(users)
    // }
    // catch(e){
    //     res.status(500).send()
    // }
    res.send(req.user)
})
// router.get('/users/:id', async (req, res)=>{
//     const _id = req.params.id;

//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             return res.satatus(404).send()
//         }
//         res.send(user)
//     }
//     catch(e){
//         res.status(500).send(e)
//     }
// })

router.post('/users', async (req, res)=>{
    const user = new User(req.body)

    
    try{
        await user.save()
        const status = await newUserEmail(user.email, user.name)
        // console.log('result is ', result);
        const token = await user.generateAuthToken()
        res.status(201).send({user, token, status})
    }
    catch(error){
        console.log(error)
        res.status(400).send(error)

    }
})
// router.patch('/users/:id', async (req, res)=>{
//     const _id = req.params.id
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
//     if(!isValidOperation){
//         return res.status(400).send({ error: 'Invalidupdates!' })
//     }
//     try{
//         const user = await User.findById(_id)
//         updates.forEach((update)=>user[update] = req.body[update])
//         await user.save()
//         // const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
// })
// router.delete('/users/:id', async (req, res)=>{
//     try{
//         const user = await User.findByIdAndDelete(req.params.id)
//         if(!user){
//             return res.status(404).send("No User found with this Id")
//         }
//         res.send(user)
//     }
//     catch(e){
//         res.status(500).send()
//     }
// })
router.delete('/users/me', auth,  async (req, res)=>{
    try{
        await req.user.remove()
        const status = cancelAccount(req.user.email, req.user.name)
        res.send(req.user, status)
    }
    catch(e){
        res.status(500).send()
    }
})
router.patch('/users/me', auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalidupdates!' })
    }
    try{
        updates.forEach((update)=>req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    }
    catch(e){
        res.status(400).send(e)
    }
})
router.post('/users/logout', auth,  async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            // console.log(req.token)
            // console.log(token.token)
            // console.log('-----------New Line Break-----------')
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})
router.post('/users/logoutAll', auth,  async (req, res)=>{
    try{
        req.user.tokens = [];
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

const upload = multer({
    // dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){

        // if(!file.originalname.endsWith(pdf))
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please upload an image(jpg, jpeg, png) of at most 1mb"))
        }
        // cb(new Error('File must be a PDF'))
        // Accept file, no error
        cb(undefined, true)
        // reject file but no error
        // cb(undefined, false)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width: 250, heigth: 250}).png().toBuffer()
    req.user.avatar = buffer

    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({ error: error.messaage })
    }
)

router.delete('/users/me/avatar', auth, async (req, res)=>{
    try{
        req.user.avatar = undefined;
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(501).send()
    }
    
    res.send(task)

})
router.get('/uses/:id/avatar', async(req, res)=>{
    try{
        const user = await User.findById(req.params.Id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch(e){}
})

module.exports = router