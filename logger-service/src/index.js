import express from 'express'
import { consumeMessages } from './consumeMessages.js'
const app = express()

app.listen(process.env.PORT, () => {
    console.log(`Logger-service running at PORT ${process.env.PORT}`)
})

const handleLog = async () => {
    await consumeMessages()
}

handleLog()