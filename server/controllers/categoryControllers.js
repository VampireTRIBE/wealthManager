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

      const u_data = await dbReq.userData(u_id);
      if (!u_data) {
        return res.status(404).json({ error: "User data not found" });
      }
      return res.status(200).json({
        success: "successful",
        userID: u_id,
        Data: u_data,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
  },

  async editCategory(req, res, next) {
    try {
      const { u_id, c_id } = req.params;
      const { newCategory } = req.body;

      await Category.findByIdAndUpdate(c_id, {
        $set: newCategory,
      });

      const u_data = await dbReq.userData(u_id);
      if (!u_data) {
        return res.status(404).json({ error: "User data not found" });
      }
      return res.status(200).json({
        success: "successful",
        userID: u_id,
        Data: u_data,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async delCategory(req, res, next) {
    try {
      const { u_id, c_id } = req.params;
      const category = await Category.findById(c_id);
      if (category.parentCategory === null) {
        return res.status(404).json({ error: "Can`t Delete Default Category" });
      }
      await category.deleteOne();

      const u_data = await dbReq.userData(u_id);
      if (!u_data) {
        return res.status(404).json({ error: "User data not found" });
      }
      return res.status(200).json({
        success: "successful",
        userID: u_id,
        Data: u_data,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = categoryController;
