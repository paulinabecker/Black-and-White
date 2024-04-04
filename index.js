const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Jimp = require('jimp');

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.static("public"));

// Rutas
app.get("/imgRender", async (req, res) => {
  try {
    const { inputUrl } = req.query;
    if (!inputUrl) {
      return res.status(400).send("La URL de la imagen es requerida.");
    }

    // Leer la imagen del sistema de archivos local
    const imagen = await Jimp.read(inputUrl);

    let nuevo_nombre_imagen = uuidv4().slice(0, 8) + "-nuevaImagen" + ".jpg";
    const ruta_imagen = `public/assets/img/${nuevo_nombre_imagen}`;

    await imagen
        .resize(350, Jimp.AUTO)
        .greyscale()
        .writeAsync(ruta_imagen);

    const imagenData = fs.readFileSync(ruta_imagen);

    res.setHeader("Content-Type", "image/jpg");
    res.send(imagenData);
  } catch (error) {
    console.error("Hubo un error", error.message);
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
    console.log(`Servidor levantado en el puerto ${PORT}`);
});
