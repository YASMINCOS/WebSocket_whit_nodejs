const express = require('express')
const app = express()

//acessar o estilo
app.use(express.static('public'))

const http = require('http').Server(app)
const serverSocket = require('socket.io')(http)

const porta = 8000

http.listen(porta, function () {
    console.log('Servidor iniciado. Abra o navegador em http://localhost:' + porta)
})

app.get('/', function (req, resp) {
    resp.sendFile(__dirname + '/index.html')
})
serverSocket.on('connection', function (socket) {   
    //socket representa a conexao do cliente

   socket.on('login', function (nickname) {
       console.log('Cliente conectado ' + nickname)
       serverSocket.emit('chat msg', { sender: 'Sistema', message: `Usuário ${nickname} conectou.` })
       socket.nickname = nickname
   })

   socket.on('chat msg', function (msg) {
       console.log(`Msg recebida do cliente ${socket.nickname}: ${msg} `)
       // Enviar objeto com remetente e mensagem
       const messageData = { sender: socket.nickname, message: msg }
       // Enviar a mensagem para todos os clientes, incluindo o remetente
       serverSocket.emit('chat msg', messageData)
   })

   socket.on('status', function (msg) {
       serverSocket.emit('status', msg)
   })
})


