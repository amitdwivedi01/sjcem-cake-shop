const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const Video = require('../models/video');

// get All videos details
router.get("/", async (req, res) => {
    try {
      let video = await Video.find();
      res.json(video);
    } catch (err) {
      console.log(err);
      res.json(
        {
            status: BAD,
            message: "something went wrong!",
            error: err.message
        }
    )
    }
});

// uplaod video
router.post("/upload-video", upload.single("video"), async (req, res) => {
    try {
      // Upload video to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
       // Create new video
      let video = new Video({
        name: req.body.name,
        video: result.secure_url,
        cloudinary_id: result.public_id,
      });
      // Save video
      await video.save();
      res.json(
        {
            status: OK,
            message: 'videos uploaded successfully!',
            video: video
        }  
    );
    } catch (err) {
      console.log(err);
      res.json(
        {
            status: BAD,
            message: "something went wrong!",
            error: err.message
        }
    )
    }
});


// update video by id
router.put("/update-video/:id", upload.single("video"), async (req, res) => {
    try {
      let video = await Video.findById(req.params.id);
      // Delete video from cloudinary
      await cloudinary.uploader.destroy(user.cloudinary_id);
      // Upload video to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      const data = {
        name: req.body.name || user.name,
        video: result.secure_url || user.avatar,
        cloudinary_id: result.public_id || user.cloudinary_id,
      };
      video = await Video.findByIdAndUpdate(req.params.id, data, {new: true});
      res.json({
          status: OK,
          message: "video is been updated successfully!",
          video: video
      });
    } catch (err) {
      console.log(err);
      res.json(
        {
            status: BAD,
            message: "something went wrong!",
            error: err.message
        }
    )
    }
});



// delete specific video by id
router.delete("/delete-video/:id", async (req, res) => {
    try {
      // Find video by id
      let video = await Video.findById(req.params.id);
      // Delete video from cloudinary
      await cloudinary.uploader.destroy(video.cloudinary_id);
      // Delete video from db
      await video.remove();
      res.json(
          {
              status: OK,
              message: "video is been deleted successfully!",
              video: video
          }
      );
    } catch (err) {
      console.log(err);
      res.json(
          {
              status: BAD,
              message: "something went wrong!",
              error: err.message
          }
      )
    }
});


module.exports = router;