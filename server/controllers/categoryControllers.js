const Category = require("../models/category");
const dbReq = require("../utills/databaseReq/dbReq");

const categoryController = {
  async addCategory(req, res, next) {
    try {
      const { u_id, pc_id } = req.params;
      const { newCategory } = req.body;

      let level = 1;
      if (pc_id) {
        let parent = await Category.findById(pc_id);
        if (!parent)
          return res.status(400).json({ error: "Parent Category Not Found" });

        while (parent && parent.parentCategory) {
          level++;
          if (level >= 4) {
            return res.status(400).json({
              error: "Cannot create category: nesting level cannot exceed 4",
            });
          }
          parent = await Category.findById(parent.parentCategory);
        }
      }

      await Category.create({
        ...newCategory,
        parentCategory: pc_id,
        user: u_id,
      });

      return res.status(200).json({ success: "Category Added" });

      const u_data = await dbReq.userData(id);
      if (!u_data) {
        return res.status(404).json({ error: "User data not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async editCategory(req, res, next) {
    try {
      const { u_id, c_id } = req.params;
      const { newCategory } = req.body;

      await Category.findByIdAndUpdate(c_id, {
        $set: newCategory,
      });

      return res.status(200).json({
        success: "✅ Category name updated successfully",
      });

      const u_data = await dbReq.userData(u_id);
      if (!u_data) {
        return res.status(404).json({ error: "User data not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async delCategory(req, res, next) {
    try {
      const { u_id, c_id } = req.params;
      const category = await Category.findById(c_id);
      if (category.parentCategory === null) {
        return res.status(404).json({ error: "Can`t Delete Default Category"});
      }
      await category.deleteOne();
      return res.status(200).json({
        success: "✅ Category Deleted successfully",
      });

      const u_data = await dbReq.userData(u_id);
      if (!u_data) {
        return res.status(404).json({ error: "User data not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = categoryController;
