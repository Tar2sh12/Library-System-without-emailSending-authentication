import Book from "./../../../DB/models/Book.model.js";
import Author from "./../../../DB/models/Author.model.js";
export const addBook = async (req, res, next) => {
  try {
    const { title, content, author, publishedDate } = req.body;
    const users = await Author.find().countDocuments();
    if (!users) {
      return res.json({ msg: "there is no authors to asign this book to" });
    }

    const isAuthorFound = await Author.findOne({ name: author });
    if (!isAuthorFound) {
      return res.json({ msg: "no author exists with this username" });
    }
    const instanceOfBook = new Book({
      title,
      content,
      author,
      publishedDate,
    });
    isAuthorFound.books.push(instanceOfBook._id);
    const authorFound = await isAuthorFound.save();
    const book = await instanceOfBook.save();

    res.json({ msg: "book created ", book: book });
  } catch (error) {
    console.log(error, "error in adding book");
    res.json({ msg: "internal server error" });
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { id } = req.params;
    const bookFound = await Book.findById(id);
    if (!bookFound) {
      return res.json({ msg: "book not found" });
    }
    bookFound.title = title;
    const newBook = await bookFound.save();
    res.json(newBook);
  } catch (error) {
    console.log(error, "error in updating a Book");
    res.json({ msg: "internal server error" });
  }
};

//special API to chanllenge myself
//API for switching from author to another
export const updateBookAuthor = async (req, res, next) => {
  try {
    const { author } = req.body;
    const { id } = req.params;
    const bookFound = await Book.findById(id);
    if (!bookFound) {
      return res.json({ msg: "book not found" });
    }
    const oldAuthor = await Author.findOne({ name: bookFound.author });
    const newAuthor = await Author.findOne({ name: author });
    if (!newAuthor) {
      return res.json({ msg: "author u want to switch to does not exist" });
    }
    // find index of objectId of this book
    const found = oldAuthor.books.indexOf(id);
    //remove book from old author's array
    oldAuthor.books.splice(found, 1);
    //add book for new author's array
    newAuthor.books.push(bookFound._id);
    //update name of author in book document
    bookFound.author = author;
    await newAuthor.save();
    await oldAuthor.save();
    const newBook = await bookFound.save();
    res.json({ msg: newBook });
  } catch (error) {
    console.log(error, "error in updating a Book");
    res.json({ msg: "internal server error" });
  }
};
export const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookFound = await Book.findById(id);
    if (!bookFound) {
      return res.json({ msg: "book not found" });
    }
    const oldAuthor = await Author.findOne({ name: bookFound.author });
    const found = oldAuthor.books.indexOf(id);
    oldAuthor.books.splice(found, 1);
    await oldAuthor.save();
    const book = await Book.deleteOne({ _id: id }); // returns deleted count
    res.json(book);
  } catch (error) {
    console.log(error, "\nerror in deleting  a book");
    res.json({ msg: "internal server error" });
  }
};

export const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find().limit(5);
    res.json(books);
  } catch (error) {
    console.log(error, "error in retrieving all books");
    res.json({ msg: "internal server error" });
  }
};

export const getABook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    res.json(book);
  } catch (error) {
    console.log(error, "error in retrieving  an Author");
    res.json({ msg: "internal server error" });
  }
};

export const search = async (req, res, next) => {
  try {
    const {search}= req.body;
    const result = await Book.find({
      $or: [
        { title: { $regex: search , $options: 'i'} },// for making it case insensitive search
        { author: { $regex: search , $options: 'i'} }
      ]
    });
    res.json({msg:result})
  } catch (error) {
    console.log(error, "error in searching");
    res.json({ msg: "internal server error" });
  }
} 
