const storeController = require("../controllers/storeController");
const express = require("express");
const path = require("path");
const storeRouter = express.Router();
const rootDir = require("../utils/path-util");


storeRouter.get("/", storeController.getAirbnb);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/homes/:homeId", storeController.getHomeDetails);
storeRouter.get("/favourites", storeController.getFavourites);
storeRouter.post("/favourites", storeController.postAddFavourites);
storeRouter.post("/favourites/delete/:homeId", storeController.postRemoveFavourite);
storeRouter.get("/rules/:houseId", storeController.getRules);

module.exports = storeRouter;
