import ProductCategory from "../../mongodb/models/product/productCategory.js";

// @route GET /products/category
// @access Private
const getCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find().lean();

    categories.forEach(async (category) => {
      if (category.name.length > 25)
        await ProductCategory.findByIdAndDelete(category._id);
    });

    return res.status(200).json(categories);
  } catch (err) {
    console.log(err)
  }
};

// @route POST /products/category
// @access Private
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: "Invalid fields" });

    // Check for duplicate
    const duplicate = await ProductCategory.findOne({ name }).lean();

    if (duplicate) return res.status(409).json({ message: "Duplicate category" });

    // Create a new
    const newCategory = await ProductCategory.create({
      name,
      description,
    });

    if (!newCategory) return res.status(400).json({ message: "Invalid data" });

    return res.status(201).json(newCategory);
  } catch (err) {
    console.log(err)
  }
};

// @route PUT /products/category
// @access Private
const updateCategory = async (req, res) => {
  try {
    const { id, name, description } = req.body;

    const updatedCategory = await ProductCategory.findByIdAndUpdate(id, {
      name,
      description,
    });

    return res.status(200).json(updatedCategory);
  } catch (err) {
    console.log(err)
  }
};

// @route DELETE /products/category
// @access Private
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedCategory = await ProductCategory.deleteMany({ _id: id });

    return res.status(200).json({ message: "Delete category successfully" });
  } catch (err) {
    console.log(err)
  }
};

export { getCategories, createCategory, updateCategory, deleteCategory };
