const user = require("../models/user");
const passport = require("passport");
const dbReq = require("../utills/databaseReq/dbReq");
const assetsCat = require("../models/assets/assetsCat");
const updateCurrentValuesByFilter = require("../utills/agregations/assets/products/updateCurrentValueUnrealizedGainFilter");
const updateConsolidatedValues = require("../utills/agregations/assets/categories/consolidated/updateConsolidatedValues");
const updateCurrentYearGains = require("../utills/agregations/assets/products/updateCurrentYearGains");
const updateStandaloneGains = require("../utills/agregations/assets/categories/standaloneStats/updateCurrentvalueUnrealizedGainCurrentYearGain");
const {
  getAllSubCategoryIds,
  getLeafCategoryIds,
} = require("../utills/agregations/assets/findsAllCategoryIDs");
const updateConsolidatedIRR = require("../utills/agregations/assets/categories/consolidated/updateConsolidatedIRR");
const recordCategoryCurves = require("../utills/agregations/assets/categoryCarve/updateCurveValues");

const usersControllers = {
  async registerUser(req, res, next) {
    try {
      const { newUser, password } = req.body;
      const new_user = await user.register(new user(newUser), password);

      await assetsCat.create({
        name: "ASSETS",
        description: "Assets Category",
        parentCategory: null,
        user: new_user._id,
      });

      req.login(new_user, async (err) => {
        if (err) return next();
        const u_data = await dbReq.userData(new_user._id);
        if (!u_data) {
          return res.status(404).json({ error: "User data not found" });
        }

        return res.status(200).json({
          success: "Login successful",
          userID: new_user._id,
          Data: u_data,
        });
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async loginUser(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res.status(400).json({ error: info?.message || "Login failed" });

      req.login(user, async (err) => {
        if (err) return next(err);

        const rootAssetsCategoryId = await assetsCat
          .findOne({ name: "ASSETS", parentCategory: null }, { _id: 1 })
          .lean();
        const assetsSubCategoriesIDs = await getAllSubCategoryIds(user._id);

        await updateCurrentValuesByFilter({ userId: user._id });
        await updateCurrentYearGains({ userId: user._id });
        await updateStandaloneGains(assetsSubCategoriesIDs);
        const leafcategorys = await getLeafCategoryIds(user._id);
        for (const catid of leafcategorys) {
          await updateConsolidatedValues(catid);
        }
        await updateConsolidatedValues(rootAssetsCategoryId?._id);
        await updateConsolidatedIRR(rootAssetsCategoryId?._id);

        assetsSubCategoriesIDs.push(rootAssetsCategoryId._id);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await recordCategoryCurves(assetsSubCategoriesIDs, today);
        const [c_data, u_data] = await Promise.all([
          dbReq.getCategoryCurveData(user._id,90),
          dbReq.userData(user._id),
        ]);

        if (!u_data) {
          return res.status(404).json({ error: "User data not found" });
        }
        return res.status(200).json({
          success: "Login successful",
          userID: user._id,
          Data: u_data,
          CData: c_data,
        });
      });
    })(req, res, next);
  },

  async logoutUser(req, res, next) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ success: "LogOut successful" });
    });
  },

  async isLogedIn(req, res, next) {
    if (req.isAuthenticated()) {
      res.json({ authenticated: true, user_id: req.user._id });
    } else {
      res.json({ authenticated: false });
    }
  },
};

module.exports = usersControllers;
