const morgan = require('morgan')
const express = require('express');
const cors = require('cors')
const expressWS = require('express-ws')

const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const ROOM = {}
const app = express();
const appWS = expressWS(app)

app.use(morgan('combined'))
app.use(cors())

app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`)        
})

app.ws('/chat', (ws, req) => {
    const name = req.query.name
    console.info(`New webscoket connection: ${name}`)
    // add the web socket connection to the room
    ws.particpantName = name
    ROOM[name] = ws

    const chat = JSON.stringify({
        from: name,
        message: 'in the houzzz!',
        timeStamp: (new Date()).toString()
    })
    for (let p in ROOM) {
        ROOM[p].send(chat)
    }


    // construct the received message and broadcast back out
    ws.on('message', (payload) => {

        const chat = JSON.stringify({
            from: name,
            message: payload,
            timeStamp: (new Date()).toString()
        })

        // loop through all active websocket subscriptions and push them the message
        console.info('test1')
        for (let p in ROOM) {
            ROOM[p].send(chat)
        }
    })

    ws.on('close', ()=>{
        console.info(`Closing connection for ${name}`)
        console.info('test2')

        ROOM[name].close()
        // remove name from the room
        delete ROOM[name]
    })

})