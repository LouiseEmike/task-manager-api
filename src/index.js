const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT;

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
    console.log('Server is up on port ' + port)
});
// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async () =>{
//     // const user = await User.findById('5dd464f0b119a11794427dd5')
//     const user = await User.findById('5dd46bb5f2b3cf2238c9f1c7')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()
// const pet = {
//     name: 'hal'
// }
// pet.toJSON = function(){
//     // console.log(this)
//     return {}
// }
// console.log(JSON.stringify(pet))