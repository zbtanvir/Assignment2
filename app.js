const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB configuration
const mongoURI = 'mongodb://localhost:27017/ZobayerBhuiyanTanvir'; 

mongoose.connect(mongoURI);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Product model
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  category: String,
});

const Product = mongoose.model('Product', productSchema);

// Controller
const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  addProduct: async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      res.json(savedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateProductById: async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  removeProductById: async (req, res) => {
    try {
      const removedProduct = await Product.findByIdAndRemove(req.params.id);
      if (!removedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(removedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  removeAllProducts: async (req, res) => {
    try {
      await Product.deleteMany({});
      res.json({ message: 'All products removed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  findProductsByName: async (req, res) => {
    try {
      const keyword = req.query.name;
      const products = await Product.find({ name: { $regex: new RegExp(keyword, 'i') } });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to DressStore application.' });
});

app.get('/api/products', productController.getAllProducts);
app.get('/api/products/:id', productController.getProductById);
app.post('/api/products', productController.addProduct);
app.put('/api/products/:id', productController.updateProductById);
app.delete('/api/products/:id', productController.removeProductById);
app.delete('/api/products', productController.removeAllProducts);
app.get('/api/products', productController.findProductsByName);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`You can access the server at: http://localhost:${port}`);
});
