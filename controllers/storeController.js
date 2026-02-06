const Home = require("../models/Home");
const fs = require("fs");
const User = require("../models/User");
const rootDir = require("../utils/path-util");
const path = require("path");


exports.getAirbnb = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/airbnb-home", {
      homes: registeredHomes,
      pageTitle: "Hamara airbnb",
    });
  });
};

exports.getHomes = (req, res, next) => {  
  Home.find().then((registeredHomes) => {
    res.render("store/homes", {
      homes: registeredHomes,
      pageTitle: "Hamara airbnb", 
    });
  });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    // const home=homes[0];
    if (!home) return res.redirect("/homes");
        res.render("store/home-details", { home: home, pageTitle: "home details",   
    });

  });
};


exports.getFavourites = async (req, res, next) => {
  const userId=Object(req.session.userId);

  const user=await User.findById(userId).populate('favouriteHomes');
  res.render("store/favourites", {
    homes: user.favouriteHomes,
    pageTitle: "Favourites",
  });
};



exports.postAddFavourites = async (req, res, next) => {
  const homeId = req.body.id;
  const userId=Object(req.session.userId);

  try{
    const user=await User.findOne({_id:userId});
    if(!user.favouriteHomes.includes(homeId)){
      user.favouriteHomes.push(homeId);
      await user.save();
    }
  }catch(error){
    console.log(error);
  }finally{
    res.redirect('/favourites');
  }
};

exports.postRemoveFavourite = (req, res, next) => {
  const homeId = req.params.homeId;
  Favourite.findOneAndDelete({homeId}).then(() => {
    res.redirect("/favourites");
  })
  .catch(error=> {
      console.log("error while deleting from favourites : ", error);
      res.redirect("/favourites")
    });
};


exports.getRules = async (req, res, next) => {
  const rulesFileName='Airbnb-Rules.pdf';
  const filePath=path.join(rootDir,'rules',rulesFileName);
  res.sendFile(filePath);
  // res.download(filePath);
};
