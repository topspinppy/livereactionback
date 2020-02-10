import express from 'express'
import bodyParser from 'body-parser'
// import http from 'http'
import socketIO from 'socket.io'
import axios from 'axios'


const server = express()
const port = 9000;

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

async function getReactions(accessToken, postid) {
    let apiLink = `https://graph.facebook.com/v4.0/${postid}/reactions?access_token=${accessToken}`
    let a = await axios.get(apiLink)
    let count = {
        LIKE: 0,
        LOVE: 0,
        WOW: 0,
        HAHA: 0,
        SAD: 0,
        ANGRY: 0,
        THANKFUL: 0,
        PRIDE: 0
    }
    a.data.data.map((data) => {
        if (data.type === "LIKE") {
            count.LIKE++
        }
        if (data.type === "LOVE") {
            count.LOVE++
        }
        if (data.type === "WOW") {
            count.WOW++
        }
        if (data.type === "HAHA") {
            count.HAHA++
        }
        if (data.type === "SAD") {
            count.SAD++
        }
        if (data.type === "ANGRY") {
            count.ANGRY++
        }
        if (data.type === "THANKFUL") {
            count.THANKFUL++
        }
        if (data.type === "PRIDE") {
            count.PRIDE++
        }
    })

    return count
}


const app = server.listen(port, function (err, result) {
    console.log('running in port' + port)
})

const io = socketIO.listen(app);

io.on('connection', client => {
    console.log('connected')
    client.on('tokens', function (message) {

        setInterval(() => {
            getReactions(message.accessToken, message.postid).then((data) => {
                io.sockets.emit('update-reaction', data)
            })
        },2000)
    })
})