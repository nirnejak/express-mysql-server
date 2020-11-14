require('dotenv').config()

const path = require('path')
const express = require('express')
const fileUpload = require('express-fileupload')
const chalk = require('chalk')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mysql = require('mysql2')
const Redis = require('ioredis')

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
app.use(express.static(path.join(__dirname, 'public')))
app.use(fileUpload())

app.get('/', (req, res) => res.send('Welcome to todo App'))

app.get('/todo', (req, res) => {
  redis.get('todos', (err, result) => {
    if (err) {
      return res.status(500).send(err)
    } else {
      if (result !== null) {
        return res.json(JSON.parse(result))
      } else {
        connection.query('SELECT * FROM todo;', (err, results) => {
          if (err) {
            return res.status(500).send(err)
          } else {
            redis.set('todos', JSON.stringify(results), 'EX', 10)
            return res.json(results)
          }
        })
      }
    }
  })
})

app.get('/todo/:id', (req, res) => {
  connection.query('SELECT * FROM todo WHERE todo.id = ?;', [req.params.id], (err, results) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (results.length) {
        return res.json(results[0])
      } else {
        return res.status(404).json({})
      }
    }
  })
})

app.post('/todo/', (req, res) => {
  if (!req.body.title) {
    res.status(400).json({ message: 'title field cannot be empty' })
  }
  const image = req.files.image

  image.mv(`public/${image.name}`, (err) => {
    if (err) { return res.status(500).send(err) }

    connection.query('INSERT INTO todo(title, due_date, image) values(?, ?, ?);', [req.body.title, req.body.due_date, image.name], (err, result, fields) => {
      if (err) {
        return res.status(500).send(err)
      }
      return res.status(200).json({
        id: result.insertId,
        title: req.body.title,
        due_date: req.body.due_date,
        image: image.name
      })
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
