const express = require("express");
const path = require("path");
const hostController = require("../controllers/hostController");
const hostRouter = express.Router();
const rootDir = require("../utils/path-util");

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.get("/host-homes", hostController.getHostHomes);
hostRouter.get("/edit-home/:homeId", hostController.getEditHome);
hostRouter.post("/edit-home", hostController.postEditHome);
hostRouter.post("/delete-home/:homeId", hostController.postDeleteHome);


exports.hostRouter = hostRouter;
