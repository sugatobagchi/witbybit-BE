const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");

const app = express();

app.use(express.json({ limit: "20mb" }));
const cors = require("cors");
app.use(cors({ origin: "*" }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/categories", async (req, res) => {
  try {
    console.log("Hit the endpoint 1");
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.log("Error while fetching categories", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/categories/:id/products", async (req, res) => {
  try {
    console.log("Hit the endpoint 2");
    const { id } = req.params;
    const products = await prisma.product.findMany({
      where: { categoryId: id },
    });
    res.status(200).json(products);
  } catch (error) {
    console.log("Error while fetching products", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/categories", async (req, res) => {
  try {
    console.log("Hit the endpoint 3");
    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name },
    });
    res.status(200).json(category);
  } catch (error) {
    console.log("Error while creating category", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post(
  "/categories/:category/products",
  upload.single("image"),
  async (req, res) => {
    try {
      const { category } = req.params;
      let {
        productName,
        brand,
        variants,
        combinations,
        price,
        discount,
        discountType,
      } = req.body;

      price = parseInt(price);
      discount = parseInt(discount);

      // Save the image path in the database
      const image = req.file ? req.file.path : null;
      const product = await prisma.product.create({
        data: {
          name: productName,
          brand,
          image,
          categoryId: category,
          variants,
          combinations,
          priceInr: price,
          discount: {
            create: {
              value: discount,
              method: discountType,
            },
          },
        },
      });

      res.status(200).json(product);
    } catch (error) {
      console.log("Error while creating product", error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
