const mongoose = require("mongoose");
const videoSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  video: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
});
module.exports = mongoose.model("Video", videoSchema);