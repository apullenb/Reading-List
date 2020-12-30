// Book Class Represents a book
class Book {
  constructor(title, author, rating) {
    this.title = title;
    this.author = author;
    this.rating = rating;
  }
}

// UI Class
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${book.rating}</td>
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td><a href="#" class="btn btn-info btn-sm delete">X</a></td>
    `;
    list.appendChild(row);
  }
  static deleteBook(e){
    if (e.classList.contains('delete')) {
      e.parentElement.parentElement.remove();
    }
  }
  static showAlert(message, className){
    const div = document.createElement('div');
    div.className=`alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#rating').value = '';
  }
}

// Store Class handles the local storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books =[];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  static removeBook(author){
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if(book.author === author) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event: display books

document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: add book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const rating = document.querySelector('#rating').value;
  // Validate form data
  if (title === '' || author === '' || rating === '') {
    UI.showAlert('Please Fill in All Fields', 'danger');
  }
  const book = new Book(title, author, rating);
  // Add book to UI
  UI.addBookToList(book);
  // Add book to local storage
  Store.addBook(book);
  UI.showAlert('Book Has Been Added', 'success');
  UI.clearFields();
});

//Event: remove book
document.querySelector('#book-list').addEventListener('click', (e) => {

  // remove from UI
  UI.deleteBook(e.target);
  // remove from local storage 
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  UI.showAlert('Book Removed', 'success');
});