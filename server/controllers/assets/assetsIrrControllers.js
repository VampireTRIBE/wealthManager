const assetsCatModel = require("../../models/assets/assetsCat");
const productModel = require("../../models/assets/assetsProduct");
const updateConsolidatedIRR = require("../../utills/agregations/assets/categories/consolidated/updateConsolidatedIRR");
const updateStandaloneIRR = require("../../utills/agregations/assets/categories/standaloneStats/updateStandaloneIRR");
const { updateIRR } = require("../../utills/agregations/assets/products/poductirr");

const IrrControllers = {
  async standalone(req, res, next) {
    const { c_id, u_id } = req.params;
    try {
      await updateStandaloneIRR([c_id]);
      const standaloneirr = await assetsCatModel.findById(c_id, "standaloneIRR");
      return res.status(200).json({
        success: "successful",
        userID: u_id,
        irr:standaloneirr.standaloneIRR,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async consolidated(req, res, next) {
    const { c_id, u_id } = req.params;
    try {
      await updateConsolidatedIRR(c_id);
      const consolidatedirr = await assetsCatModel.findById(c_id, "consolidatedIRR");
      return res.status(200).json({
        success: "successful",
        userID: u_id,
        irr:consolidatedirr.consolidatedIRR,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async productirr(req, res, next) {
    const { c_id, u_id } = req.params;
    try {
      await updateIRR(c_id);
      const productirr = await productModel.findById(c_id, "IRR");
      return res.status(200).json({
        success: "successful",
        userID: u_id,
        irr:productirr.IRR,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = IrrControllers;
