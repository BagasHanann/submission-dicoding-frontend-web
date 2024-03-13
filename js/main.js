let books = [];
let deletedIncompleteBook = null;
let markBookAsCompleted = null;

function generateBookId() {
	return +new Date();
}

function loadBooksFromStorage() {
	const storedBooks = localStorage.getItem('books');
	if (storedBooks) {
		books = JSON.parse(storedBooks);
		updateBookshelf();
	}
}

loadBooksFromStorage();

function saveBooksToStorage() {
	localStorage.setItem('books', JSON.stringify(books));
}

function handleInputBookSubmit(event) {
	event.preventDefault();
	const title = document.getElementById('inputBookTitle').value;
	const author = document.getElementById('inputBookAuthor').value;
	const year = document.getElementById('inputBookYear').value;
	const isComplete = document.getElementById('inputBookIsComplete').checked;
	addBook(title, author, year, isComplete);
	document.getElementById('inputBook').reset();
}

function addBook(title, author, year, isComplete) {
	const book = {
		id: generateBookId(),
		title: title,
		author: author,
		year: parseInt(year),
		isComplete: isComplete,
	};
	books.push(book);
	updateBookshelf();
	saveBooksToStorage();
}

function updateBookshelf(booksToShow = books) {
	const incompleteBookshelf = document.getElementById(
		'incompleteBookshelfList',
	);
	const completeBookshelf = document.getElementById('completeBookshelfList');
	incompleteBookshelf.innerHTML = '';
	completeBookshelf.innerHTML = '';

	booksToShow.forEach((book) => {
		const bookItem = document.createElement('article');
		bookItem.classList.add('book_item');
		bookItem.innerHTML = `
					<h3>${book.title}</h3>
					<p>Penulis: ${book.author}</p>
					<p>Tahun: ${book.year}</p>
					<div class="action">
							${
								book.isComplete
									? `<button class="green" data-book-id="${book.id}">Belum selesai di Baca</button>`
									: `<button class="green" data-book-id="${book.id}">Selesai dibaca</button>`
							}
							<button class="edit">Edit</button>
							<button class="red">Hapus buku</button>
					</div>
			`;

		book.isComplete
			? completeBookshelf.appendChild(bookItem)
			: incompleteBookshelf.appendChild(bookItem);
	});

	if (deletedIncompleteBook !== null) {
		const undoButton = document.createElement('button');
		undoButton.textContent = 'Undo';
		undoButton.classList.add('undo');
		incompleteBookshelf.appendChild(undoButton);
	} else if (markBookAsCompleted !== null) {
		const undoButton = document.createElement('button');
		undoButton.textContent = 'Undo';
		undoButton.classList.add('undo');
		completeBookshelf.appendChild(undoButton);
	}
}

function handleGreenButtonClick(event) {
	if (event.target.classList.contains('green')) {
		const bookId = event.target
			.closest('.book_item')
			.querySelector('h3').textContent;
		const bookIndex = books.findIndex((book) => book.title === bookId);
		if (bookIndex !== -1 && books[bookIndex].isComplete) {
			books[bookIndex].isComplete = false;
			updateBookshelf();
			saveBooksToStorage();
		} else if (bookIndex !== -1 && !books[bookIndex].isComplete) {
			books[bookIndex].isComplete = true;
			updateBookshelf();
			saveBooksToStorage();
		}
	}
}

function undoDeleteIncompleteBook() {
	if (deletedIncompleteBook !== null) {
		books.push(deletedIncompleteBook);
		deletedIncompleteBook = null;
		updateBookshelf();
		saveBooksToStorage();
	}
}

function markBookAsComplete(bookId) {
	const bookIndex = books.findIndex((book) => book.id === bookId);
	if (bookIndex !== -1 && !books[bookIndex].isComplete) {
		books[bookIndex].isComplete = true;
		updateBookshelf();
		saveBooksToStorage();
	}
}

function handleRedButtonClick(event) {
	if (event.target.classList.contains('red')) {
		const bookId = event.target
			.closest('.book_item')
			.querySelector('h3').textContent;
		const bookIndex = books.findIndex((book) => book.title === bookId);
		if (bookIndex !== -1) {
			books.splice(bookIndex, 1);
			updateBookshelf();
			saveBooksToStorage();
		}
	}
}

function handleEditButtonClick(event) {
	if (event.target.classList.contains('edit')) {
		const bookId = event.target
			.closest('.book_item')
			.querySelector('h3').textContent;
		const newTitle = prompt('Masukkan judul baru:', bookId);
		if (newTitle !== null) {
			const bookIndex = books.findIndex((book) => book.title === bookId);
			if (bookIndex !== -1) {
				books[bookIndex].title = newTitle;
				updateBookshelf();
				saveBooksToStorage();
			}
		}
	}
}
function handleSearchBookSubmit(event) {
	event.preventDefault();
	const keyword = document
		.getElementById('searchBookTitle')
		.value.trim()
		.toLowerCase();
	const filteredBooks = books.filter((book) =>
		book.title.toLowerCase().includes(keyword),
	);
	updateBookshelf(filteredBooks);
}

document
	.getElementById('inputBook')
	.addEventListener('submit', handleInputBookSubmit);
document.addEventListener('click', handleGreenButtonClick);
document.addEventListener('click', handleRedButtonClick);
document
	.getElementById('searchBook')
	.addEventListener('submit', handleSearchBookSubmit);
document.addEventListener('click', handleEditButtonClick);
document.addEventListener('click', function (event) {
	if (event.target.classList.contains('undo')) {
		undoDeleteIncompleteBook();
	}
});
