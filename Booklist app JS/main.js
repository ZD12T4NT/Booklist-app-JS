// Book Class: Represents Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm 
        delete">X</a></td>
        `;

        list.appendChild(row)

    }

    // If the classlist contains delete then it can be removed 
    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    

    static showAlert(message, className) {
        const div = document.createElement('div')
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');// Parent Element
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);// Inserting the div before form
        // Vanish alert in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000
        );
    }


    // When a new book is published the fields will be removed
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';

    }

}

// Store Class: Handles Storage(Local)

class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
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

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
            books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books))

    }
}

// Event: Display Books
// As soon as the DOM loads the books will be displayed 
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add book
document.querySelector('#book-form').addEventListener('submit', 
(e) => {

    // Prevent Submit
    e.preventDefault();


    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    // If the fields === nothing then an alert will show 
    if(title === '' || author === '' || isbn === '' ){
        // Prettier alert 
        UI.showAlert('Please Fill In All Fields', 'danger');

    } else {

    // Instantiate Book
    const book = new Book(title, author, isbn)

    // Add book to list
    UI.addBookToList(book)

    // Add book to store
    Store.addBook(book)

    // Show success message once book added
    UI.showAlert('Book Added', 'success')

    // Clear Fields
    UI.clearFields();
  }    
});

    // Event: Remove Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
    // Show once deleted
    UI.showAlert('Book Removed', 'success')
});



