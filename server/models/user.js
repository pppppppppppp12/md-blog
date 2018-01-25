import { blog } from '../config/db.js'
import { clearInterval, setInterval } from 'timers';

const userModal = '../schema/user.js'
const user = blog.import(userModal) // import 引入表结构，实例化user

const getUserById = async function (id) {
  const userInfo = await user.findOne({
    where: {
      id: id
    }
  })
  return userInfo
}

const getUserByName = async function (name) {
  const userInfo = await user.findOne({
    where: {
      user_name: name
    }
  })
  return userInfo
}

export default {
  getUserById, // 导出 getUserById
  getUserByName
}

var socket new Websocket('ws://localhost:8080')
socket.onopen = function (event) {
  // 发送消息
  socket.send('msg')
  // 监听接收消息
  socket.onmessage = function (event) {
  }
  // 监听socket关闭
  socket.onclose = function (event) {
  }
  // 关闭socket
  socket.close()
}

var socket = new io.Socket('localhost'， {
  port: 8080
})
socket.connect()

// 添加连接监听器
socket.on('connect', function () {
})
// 添加关闭连接监听器
socket.on('disconnect', function () {
})
// 通过socket发送消息到服务器
socket.send('meg')


// 用http模块启动服务器 和 socket.io
var http = require('http')
var io = require('socket.io')
// 8080端口启动服务器
var server = http.createServer(function (req, res) {
  // 发送html的header和message
  res.writeHead(200, {
    'Content-Type': 'text/html'
  })
  res.end('<h1>hello</h1>')
})
server.listen(8080)
// 创建socket.io实例
var socket = io.listen(server)
// 添加连接监听器
socket.on('connection', function (client) {
  // 监听接收信息
  client.on('message', function (event) {
  })
  // 关闭连接
  client.on('disconnect', function () {
    clearInterval(interval)
  })
})
// 创建定期发送消息到客户端的 发送器
var interval = setInterval(function () {
  client.send('mes')
}， 5000)
