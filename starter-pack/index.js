/**
 * Hack School Session 4: Express.js
 * Welcome! This is the file in which we will write our server-side logic.
 * All code that you write will be right here:
 */



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