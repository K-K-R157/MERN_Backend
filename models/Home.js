const mongoose = require("mongoose");
const Favourite = require("./Favourite");

const homeSchema = mongoose.Schema(
  //   {
  //   houseName : String,
  //   price : Number,
  //   location : String,
  //   rating : Number,
  //   photoUrl : String,
  //   description : String
  // }

  {
    houseName: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true },
    photoUrl: String,
    description: String,
    hostId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
    }
  },
);

// homeSchema.pre("findOneAndDelete", async function (next) {
//   const homeId = this.getQuery()["_id"];
//   await Favourite.deleteOne({ homeId });
//   // next();
// });

module.exports = mongoose.model("Home", homeSchema);

// here Home is class name and its corresponding collection is { lowercase of Home + s } = homes
