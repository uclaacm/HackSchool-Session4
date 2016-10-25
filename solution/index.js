// include the express framework
const express = require('express');
// include the body parser: turns POST form data into JSON
const bodyParser = require('body-parser');

// create the application
let app = express();

// define global variables
let books = [];     // an array of objects with properties {title, author, isbn, copies}
let user = null;    // the name of the user that is logged in

// expose all files in public/ to be accessible from the root of our website
app.use(express.static('public'));
// POST form data is "url-encoded", so decode that into JSON for us
app.use(bodyParser.urlencoded());
// Use Handlebars (hbs) as our template engine
app.set('view engine', 'hbs');

/**
 * Define the root of our website. If the user is not logged in, present
 * the login form. Otherwiser redirect to the library.
 */
app.get('/', (req, res) => {
	if (!user)
		return res.redirect('/login.html');
	return res.redirect('/library');
});

/**
 * Handle POST request from the login form (note, this is different than
 * showing the login form, which is done by sending back public/login.html).
 * Set the global `user` variable to whatever was sent to us by the form
 * (the attribute "name" had value "name", so the information was put into
 * `res.body.name` by the body parser)
 */
app.post('/login', (req, res) => {
	user = req.body.name || null;
	res.redirect('/');
});

/**
 * Show the book library. First verify the user is logged in. If not, redirect
 * to login page. Otherwise, render the library template (views/library.hbs) with
 * the default page state (see `makeLibraryPageState()` for all properties used in
 * library.hbs).
 */
app.get('/library', (req, res) => {
	if (!user)
		return res.redirect('/login.html');
	res.render('library', makeLibraryPageState());
});

/**
 * Delete a book by its ISBN. We defined a variable in our route, and express puts its
 * into req.params.isbn, since we named the variable `isbn` in the route path.
 * We loop through the list of books to find the index of the one with an ISBN of the
 * give one, and once we do, we remove it (see Array.splice, MDN), and stop checking, 
 * to immediately refresh the library.
 */
app.get('/books/delete/:isbn', (req, res) => {
	if (user) {
		let isbn = req.params.isbn || 0;
		for (let i = 0; i < books.length; i++) {
			if (books[i].isbn === isbn) {
				books.splice(i, 1);
				break;
			}
		}
	}

	res.redirect('/library');
});

/**
 * Define the route for searching for a particular book. We are posted a search query, which 
 * is given the name "query" in the form, and is therefore put into req.body.query by the body
 * parser. If the query and user are valid, filter the books into a new array to only those
 * whose author, title, or isbn contain the search query, and assign it as the value to the "books"
 * key in a partial object passed as the argument to makeLibraryPageState. Also assign the query
 * to the key "searchText" in this object, so the query can be displayed on the page. Finally, 
 * render the library template using the object returned from the function makeLibraryPageState.
 */
app.post('/books/search', (req, res) => {
	let query = req.body.query || "";
	if (query.length > 0 && user) {
		res.render('library', makeLibraryPageState({
			books: books.filter(function(book) {
				return book.title.indexOf(query) !== -1 ||
					   book.author.indexOf(query) !== -1 ||
					   book.isbn.indexOf(query) !== -1;
			}),
			searchText: query
		}));
	} else {
		res.redirect('/library');
	}
});

/**
 * Define the route to add a book to the library. We are posted the title, author, isbn,
 * and number of copies. The <a> || <b> syntax is for validity checking: it picks <a> if a
 * is "valid", aka defined and non-empty/non-null, otherwise it picks <b>.
 * 
 * If the inputs are valid, create a new book objects and push it into the array
 *  Redirect to the library (to re-render the page)
 * If the inputs are not valid, render the library template by passing in an object
 * with field "addFormBox" (which is another object) that details what to display on the page.
 *  show: true means show the add box. message: true means we have a message to send.
 *  messageText is the text of the message we want to display. messageSuccess: false means to
 *  display the message as a failure (unable to add the book). Finally, formInfo is another
 *  object that the library template can read to re-fill in the input that was send to the 
 *  server to show exactly what was invalid, and also so the user doesn't have to retype it.'
 */
app.post('/books/add', (req, res) => {
	if (!user)
		return res.redirect('/library');

	let title = req.body.title || "";
	let author = req.body.author || "";
	let isbn = req.body.isbn || "";
	let copies = parseInt(req.body.copies) || 0;
	
	if (title.length > 0 && author.length > 0 && isbn.length > 0 && copies > 0) {
		books.push({title, author, isbn, copies});
		res.redirect('/library');
	} else {
		res.render('library', makeLibraryPageState({
			addFormBox: {
				show: true,
				message: true,
				messageText: "An invalid argument was entered",
				messageSuccess: false,
				formInfo: {title, author, isbn, copies}
			}
		}));
	}
});

/**
 * Start the server on port 3000
 * After the server has been started, initialize the array of books
 * Print out when we're all ready to go
 */
app.listen(3000, () => {
	initBooks();
	console.log("Listening on port 3000...");
});

//////////////////////////////////////////////////////
// Functions after this point have been defined     //
// for you. You can see how they work, but put      //
// all code above this point, and don't modify      //
// or play around with it during the session. You   //
// are free to do that later, though!               //
//////////////////////////////////////////////////////


/**
 * Push in the initial books in the library into the books array.
 * Note the fields and type of each field of each object in the array.
 */
function initBooks() {
	books.push({title: "The Three Musketeers", author: "Alexandre Dumas", copies: 7, isbn: "978-1-56619-909-4"});
	books.push({title: "Ivanhoe", author: "Sir Walter Scott", copies: 2, isbn: "978-1-46110-482-3"});
	books.push({title: "The Count of Monte Cristo", author: "Alexandre Dumas", copies: 3, isbn: "978-1-39912-897-1"});
	books.push({title: "Last of the Mohicans", author: "James Fenimore Cooper", copies: 2, isbn: "978-1-87140-981-4"});
	books.push({title: "Moby Dick", author: "Herman Melville", copies: 8, isbn: "978-1-09713-891-7"});
	books.push({title: "A Tale of Two Cities", author: "Charles Dickens", copies: 14, isbn: "978-1-67819-414-4"});
	books.push({title: "Robin Hood", author: "Howard Pyle", copies: 1, isbn: "978-1-18904-912-4"});
	books.push({title: "Arabian Nights", author: "Antony Galland", copies: 6, isbn: "978-1-89231-991-4"});
}

/**
 * Generate the object read by the library template. It takes in an object which can
 * define any of the properties shown here to override these defaults. The purpose of this
 * is to make setting the page state easier, so you don't have to think about every field or
 * defaults. Just pass in the fields you want to change from these defaults.
 * 
 * @param args An object with keys and values to override the defaults
 * @return A complete page state object for the library template
 */
function makeLibraryPageState(args) {
	let data = {
		addFormBox: {
			show: args && args.addFormBox ? (args.addFormBox.show || false) : false,
			message: args && args.addFormBox ? (args.addFormBox.message || false) : false,
			messageText: args && args.addFormBox ? (args.addFormBox.messageText || "") : "",
			messageSuccess: args && args.addFormBox ? (args.addFormBox.messageSuccess || false) : false,
			formInfo: {
				title: args && args.addFormBox && args.addFormBox.formInfo ? (args.addFormBox.formInfo.title || "") : "",
				author: args && args.addFormBox && args.addFormBox.formInfo ? (args.addFormBox.formInfo.author || "") : "",
				isbn: args && args.addFormBox && args.addFormBox.formInfo ? (args.addFormBox.formInfo.isbn || "") : "",
				copies: args && args.addFormBox && args.addFormBox.formInfo ? (args.addFormBox.formInfo.copies || "") : "",
			}
		},
		books: args ? (args.books || books) : books,
		searchText: args ? (args.searchText || "") : "",
		user: args ? (args.name || user) : user 
	};

	return data;
}