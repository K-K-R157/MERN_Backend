const Home = require("../models/Home");
const { deleteFile } = require("../utils/file");

exports.getAddHome = (req, res, next) => { 
    res.render("host/edit-home", { pageTitle: "Add your home",editing:false ,
    });

};


exports.postAddHome = (req, res, next) => {

  if(!req.file){
    return res.status(400).send('no valid image provided');
  }

  // both will works

  // const photoUrl=req.file.path;

  // const photoUrl = req.file.path
  // .replace(/\\/g, '/')        // Replaces ALL backslashes with forward slashes
  // .replace('public/', '/')  // Removes 'public' so the URL starts with /images
  // .replace('uploads/', '/');   // Removes 'public' so the URL starts with /images


  const photoUrl = "/" + req.file.path
  .replace(/\\/g, '/') ;      // Replaces ALL backslashes with forward slashes
 

  const { houseName, price, location, rating,description} = req.body;


  const newHome = new Home({houseName, price, location, rating, photoUrl,description,hostId:req.session.userId});

  newHome.save().then(() => {
        res.render("host/home-added", { pageTitle: "Home hosted",   // isLoggedIn:req.session.isLoggedIn 
    });
  }).catch(error=>{
    console.log(error);   
    res.redirect('/');
  })
};



exports.getHostHomes= (req, res, next) => {
  const userId=Object(req.session.userId);
    Home.find({hostId:userId}).then((registeredHomes) => {
    res.render("host/host-homes", {
      homes: registeredHomes,
      pageTitle: "Host Homes",
    });
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing==='true';
  if(!editing){
    console.log('editing flag not set properly');
    return res.redirect('/host/host-homes');
  }
  Home.findById(homeId).then((home)=>{ 
    if(!home){
      console.log('home not found for editing');   
      return res.redirect('/host/host-homes');

    }
        res.render("host/edit-home", { pageTitle: "Edit your Home", home:home,editing:editing,    // isLoggedIn:req.session.isLoggedIn 
    });


  })
};

exports.postEditHome = (req, res, next) => {

  const {id,houseName, price, location, rating,description } = req.body;


  // if(!req.file){
  //   return res.status(400).send('no valid image provided');
  // }

  // const photoUrl = "/" + req.file.path
  // .replace(/\\/g, '/') ;      // Replaces ALL backslashes with forward slashes
 
  Home.findById(id).then(existingHome=>{
    if(!existingHome){
      console.log('Home not found for editing');
      return res.redirect('/host/host-homes');
    }
     existingHome.houseName=houseName;
      existingHome.price=price;
      existingHome.location=location;
      existingHome.rating=rating;
     
      if (req.file) {
        // If the path in DB is "/public/images/abc.jpg", 
        // we want to pass "public/images/abc.jpg" to our delete function
        const pathToDelete = existingHome.photoUrl.startsWith('/') 
            ? existingHome.photoUrl.substring(1) 
            : existingHome.photoUrl;

        deleteFile(pathToDelete);

        // Save the new file path (ensuring it's web-friendly)
        existingHome.photoUrl = "/" + req.file.path.replace(/\\/g, '/');
    }
      // existingHome.photoUrl=photoUrl;
      existingHome.description=description;
    return existingHome.save();
  }).finally(()=>{
    return res.redirect('/host/host-homes');
  })

};


exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId).then(()=>{
    res.redirect('/host/host-homes');
  })
};

