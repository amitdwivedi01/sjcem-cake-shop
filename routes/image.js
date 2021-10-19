const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const Image = require('../models/image');

// get All Images details
router.get("/", async (req, res) => {
    try {
      let image = await Image.find();
      res.json(image);
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

// upload Image
router.post("/image-upload", upload.single("image"), async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
       // Create new image
      let image = new Image({
        name: req.body.name,
        image: result.secure_url,
        cloudinary_id: result.public_id,
      });
      // Save image
      await image.save();
      
     
    //   res.json(
    //     {
    //         status: 200,
    //         message: 'images uploaded successfully!',
    //         image: image
    //     }  
    // );
    res.redirect("/blog")
    } catch (err) {
      console.log(err);
    return  res.json (
        {
            status: 400,
            message: "something went wrong!",
            error: err.message
        }
    )
    res.send('something went wrong file not uploaded');
    }
});


// update Image by id
router.put("/update-image/:id", upload.single("image"), async (req, res) => {
    try {
      let image = await Image.findById(req.params.id);
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(user.cloudinary_id);
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      const data = {
        name: req.body.name || user.name,
        image: result.secure_url || user.avatar,
        cloudinary_id: result.public_id || user.cloudinary_id,
      };
      image = await Image.findByIdAndUpdate(req.params.id, data, {new: true});
      res.json({
          status: OK,
          message: "Image is been updated successfully!",
          image: image
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


// delete specific image by id
router.delete("/delete-image/:id", async (req, res) => {
    try {
      // Find image by id
      let image = await Image.findById(req.params.id);
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(image.cloudinary_id);
      // Delete image from db
      await image.remove();
      res.json(
          {
              status: OK,
              message: "image is been deleted successfully!",
              image: image
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