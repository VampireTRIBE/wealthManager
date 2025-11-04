const assetsStatementModel = require("../../models/assets/assetsStatements");
const assetsCatModel = require("../../models/assets/assetsCat");
const dbReq = require("../../utills/databaseReq/dbReq");

const assetsStatementControllers = {
  async deposit(req, res, next) {
    const { u_id, c_id } = req.params;
    const { statement } = req.body;
    try {
      const cat = await assetsCatModel.findById(c_id);
      if (cat.parentCategory === null) {
        return res
          .status(400)
          .json({ error: "Can`t Deposit in Default Category" });
      }
      const newStatement = await assetsStatementModel.create({
        ...statement,
        type: "deposit",
        user: u_id,
        category_id: c_id,
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

  async withdrawal(req, res, next) {
    const { u_id, c_id } = req.params;
    const { statement } = req.body;
    try {
      const cat = await assetsCatModel.findById(c_id);
      if (cat.parentCategory === null) {
        return res
          .status(400)
          .json({ error: "Can`t Withdrawal in Default Category" });
      }
      const newStatement = await assetsStatementModel.create({
        ...statement,
        type: "withdrawal",
        user: u_id,
        category_id: c_id,
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
};

module.exports = assetsStatementControllers;
