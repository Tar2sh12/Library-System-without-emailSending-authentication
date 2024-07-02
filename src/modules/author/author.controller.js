import Author from "./../../../DB/models/Author.model.js";
export const addAuthor = async (req, res, next) => {
  try {
    const { name, bio, bdate } = req.body;
    const isNameExist = await Author.findOne({ name });
    if (isNameExist) {
      return res.json({ message: "User name already exists" });
    }
    const instanceOfAuthor = new Author({
      name,
      bio,
      bdate,
    });
    const author = await instanceOfAuthor.save();
    res.json({ msg: "author added ", author: author });
  } catch (error) {
    console.log(error, "error in adding author");
    res.json({ msg: "internal server error" });
  }
};

export const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find().populate([{path:"books"}]);
    res.json(authors);
  } catch (error) {
    console.log(error, "error in retrieving all authors");
    res.json({ msg: "internal server error" });
  }
};

export const getAnAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const authors = await Author.findById(id);
    res.json(authors);
  } catch (error) {
    console.log(error, "error in retrieving  an Author");
    res.json({ msg: "internal server error" });
  }
};
export const updateAuthor = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const author = await Author.findById(id);
    author.name = name;
    const newAuthor = await author.save();
    res.json(newAuthor);
  } catch (error) {
    console.log(error, "error in updating  an Author");
    res.json({ msg: "internal server error" });
  }
};
export const deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await Author.deleteOne({ _id: id }); // returns deleted count
    res.json(author);
  } catch (error) {
    console.log(error, "error in deleting  an Author");
    res.json({ msg: "internal server error" });
  }
};

export const search = async (req, res, next) => {
  try {
    const {search}= req.body;
    const result = await Author.find({
      $or: [
        { name: { $regex: search , $options: 'i'} },// for making it case insensitive search
        { bio: { $regex: search , $options: 'i'} }
      ]
    });
    res.json({msg:result})
  } catch (error) {
    console.log(error, "error in searching");
    res.json({ msg: "internal server error" });
  }
} 