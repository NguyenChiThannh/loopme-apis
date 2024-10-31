import express from 'express'
import { consumeMessages } from './consumeMessages.js'
const app = express()

app.listen(process.env.PORT, () => {
    console.log(`Server starting at PORT ${process.env.PORT}`)
})

const handleErrorLog = async () => {
    await consumeMessages()
}

handleErrorLog()