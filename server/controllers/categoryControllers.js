const custom_error = require("../utills/errors/custom_error");
const Category = require("../models/category");
const dbReq = require("../utills/databaseReq/dbReq");

const categoryController = {
  async addCategory(req, res, next) {
    try {
      const { id, c_id } = req.params;
      const { name, description = "Null" } = req.body;

      if (!name) throw new Error("Category name is required");

      let level = 1;
      if (c_id) {
        let parent = await Category.findById(c_id);
        if (!parent) throw new Error("Parent category not found");

        while (parent && parent.parentCategory) {
          level++;
          if (level >= 4) {
            throw new Error(
              "Cannot create category: nesting level cannot exceed 4"
            );
          }
          parent = await Category.findById(parent.parentCategory);
        }
      }

      // Create new category
      const newCategory = await Category.create({
        name,
        description,
        parentCategory: c_id,
        user: id,
      });

      const u_data = await dbReq.userData(id);
      if (!u_data) {
        return res.status(404).json({ error: "User data not found" });
      }
      res.status(200).json({
        message: "Category Added",
        user_id: id,
        Data: u_data,
      });
    } catch (error) {
      req.flash("error", error.message);
      next(new custom_error(400, error.message));
    }
  },

  async delCategory(req, res, next) {
    try {
      const { id, c_id, s_id } = req.params;

      // Find the category to delete
      const category = await Category.findById(s_id);
      if (!category) {
        throw new Error("Category not found");
      }

      // Delete the category (triggers cascade delete in schema)
      await category.deleteOne();

      // Fetch updated user data
      const u_data = await dbReq.userData(id);
      if (!u_data) {
        return res.status(404).json({ error: "User data not found" });
      }

      res.status(200).json({
        message: "Category deleted successfully",
        user_id: id,
        Data: u_data,
      });
    } catch (error) {
      req.flash("error", error.message);
      next(new custom_error(400, error.message));
    }
  },
  async editCategory(req, res, next) {
    try {
      const { id, c_id, s_id } = req.params;

      // Find the category to delete
      const category = await Category.findById(s_id);
      if (!category) {
        throw new Error("Category not found");
      }

      // Delete the category (triggers cascade delete in schema)
      await category.deleteOne();

      // Fetch updated user data
      const u_data = await dbReq.userData(id);
      if (!u_data) {
        return res.status(404).json({ error: "User data not found" });
      }

      res.status(200).json({
        message: "Category deleted successfully",
        user_id: id,
        Data: u_data,
      });
    } catch (error) {
      req.flash("error", error.message);
      next(new custom_error(400, error.message));
    }
  },
  
  async editCategory(req, res, next) {
  try {
    const { id, c_id, s_id } = req.params;
    const { name } = req.body;

    if (!name) throw new Error("Category name is required");

    const category = await Category.findById(s_id);
    if (!category) throw new Error("Category not found");

    // Update only the name
    category.name = name;
    await category.save();

    // Fetch updated user data
    const u_data = await dbReq.userData(id);
    if (!u_data) return res.status(404).json({ error: "User data not found" });

    res.status(200).json({
      message: "✅ Category name updated successfully",
      user_id: id,
      Data: u_data,
    });
  } catch (error) {
    next(new custom_error(400, error.message));
  }
},

};

module.exports = categoryController;
