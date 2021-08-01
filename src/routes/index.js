const { Router } = require("express");
const router = Router();

const Photo = require('../models/Photo');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})

const fs = require('fs-extra')

router.get("/", async (req, res) => {
  //llamara a la base de datos
   const photos= await Photo.find()
  res.render("images", {photos});
});

router.get("/images/add", async (req, res) => {
  const photos= await Photo.find()
  res.render("image-forms", {photos});
});

router.post("/images/add", async (req, res) => {

    // obtiene la data del formulario
    const { title, description} = req.body
    //sube la imagen a Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "demo"
    })
    
    // creara un esquema de la foto a subir a la DB
    const newPhoto = new Photo({
        title: title,
        description: description,
        imageUrl: result.url,
        secureUrl: result.secure_url,
        public_id: result.public_id
    })
    await newPhoto.save();
    // Eliminara la foto que se sube
    await fs.unlink(req.file.path)

    res.redirect("/");
});

router.get('/images/delete/:photo_id', async (req, res) => {
  const { photo_id } = req.params;
  const photo = await Photo.findByIdAndRemove(photo_id);
  const result = await cloudinary.v2.uploader.destroy(photo.public_id);
  console.log(result)
  res.redirect('/images/add');
});

module.exports = router;
