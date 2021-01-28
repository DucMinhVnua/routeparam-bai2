// Express
const express = require('express');
const app = express();
const port = 300;

// POST
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))


// lowdb
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { render } = require('pug');
const adapter = new FileSync('database.json');
const db = low(adapter);
db.defaults({ books: [] }).write(); // đoạn này để set default trong file json ta có một mạng posts rỗng
module.exports = db;

// pug
app.set('view engine', 'pug')
app.set('views', './views')

// get database


// ---------- get

// Home books 
app.get('/books', function (req, res) {
  const books = db.get('books').value();
  res.render('books', {
    books: books
  });
})

// Create books
app.get('/books/create', function (req, res) {
  res.render('add');
})

app.get('/add/book', function (req, res) {
  const ID = function () {
    return Math.random();
  };

  const queryParamBook = req.query;
  queryParamBook.id = ID();
  console.log(queryParamBook);
  if(queryParamBook.title != '') {
    db.get('books').push(queryParamBook).write();
    res.redirect('/books');
  }
})

// update book
app.get('/books/update/:id', function (req, res){
  res.render('update', {
    id: req.params
  });
})

app.get('/books/create/updatebook/:idBook', function (req, res){
  const id = parseFloat(req.params.idBook);
  const book = db.get('books').find({id: id}).assign({description: req.query.description}).write();
  res.redirect('/books');
})


// delete book
app.get('/books/delete/:id', function (req, res) {
  const id = parseFloat(req.params.id);
  const book = db.get('books').remove({id: id}).write();
  res.redirect('/books');
})


// ------------ post


// localhost
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
