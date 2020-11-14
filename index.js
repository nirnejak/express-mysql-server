require('dotenv').config()

const express = require('express')
const chalk = require('chalk')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mysql = require('mysql2')
const Redis = require('ioredis')
const { red } = require('chalk')

const redis = new Redis()
const app = express()

app.use(cors())
app.use((req, res, next) => {
  console.log(`${chalk.white.bold.inverse(` ${req.method} `)} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
  next()
})
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Welcome to todo App')
})

app.get('/todo', (req, res) => {
  redis.get('todos', (err, result) => {
    if (err) {
      res.status(500).json(err)
    } else {
      if (result !== null) {
        console.log('From Cache')
        return res.json(JSON.parse(result))
      } else {
        console.log('From Database')
        connection.query('SELECT * FROM todo;', (err, results) => {
          if (err) {
            res.status(500).json(err)
          } else {
            redis.set('todos', JSON.stringify(results), 'EX', 10)
            res.json(results)
          }
        })
      }
    }
  })
})

app.get('/todo/:id', (req, res) => {
  connection.query('SELECT * FROM todo WHERE todo.id = ?;', [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json(err)
    } else {
      if (results.length) {
        res.json(results[0])
      } else {
        res.status(404).json({})
      }
    }
  })
})

app.post('/todo/', (req, res) => {
  if (!req.body.title) {
    res.status(400).json({ message: 'title field cannot be empty' })
  }
  connection.query('INSERT INTO todo(title) values(?);', [req.body.title], (err, result, fields) => {
    if (err) {
      res.status(500).json(err)
    }
    res.status(200).json({
      id: result.insertId,
      title: req.body.title
    })
  })
})

app.put('/todo/:id', (req, res) => {
  // TODO: update a todo
})

app.delete('/todo/:id', (req, res) => {
  // TODO: delete a todo
})

app.get('*', function (req, res) {
  res.status(404).json({ error: true, message: 'Not Found' })
})

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'todoapp'
})
app.listen(process.env.PORT, () => {
  console.log(chalk.green(`👍  Server started at PORT: ${process.env.PORT}`))
})

module.exports = app
