import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { Admin, Cart, FoodItem, Orders, Restaurant, User } from './Schema.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = 6001;

// Connect to MongoDB
mongoose.connect('mongodb+srv://register:JPCvdIDLzRaJJXTF@cluster0.y4bom.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Successfully');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

// Routes
app.post('/register', async (req, res) => {
  const { username, email, usertype, password, restaurantAddress, restaurantImage } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (usertype === 'restaurant') {
      const newUser = new User({
        username, email, usertype, password: hashedPassword, approval: 'pending'
      });
      const user = await newUser.save();
      console.log(user._id);
      const restaurant = new Restaurant({ ownerId: user._id, title: username, address: restaurantAddress, mainImg: restaurantImage, menu: [] });
      await restaurant.save();
      return res.status(201).json(user);

    } else {
      const newUser = new User({
        username, email, usertype, password: hashedPassword, approval: 'approved'
      });
      const userCreated = await newUser.save();
      return res.status(201).json(userCreated);
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    } else {
      return res.json(user);
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Promote restaurant
app.post('/update-promote-list', async (req, res) => {
  const { promoteList } = req.body;
  try {
    const admin = await Admin.findOne();
    admin.promotedRestaurants = promoteList;
    await admin.save();
    res.json({ message: 'approved' });

  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Approve restaurant
app.post('/approve-user', async (req, res) => {
  const { id } = req.body;
  try {
    const restaurant = await User.findById(id);
    restaurant.approval = 'approved';
    await restaurant.save();
    res.json({ message: 'approved' });

  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Reject restaurant
app.post('/reject-user', async (req, res) => {
  const { id } = req.body;
  try {
    const restaurant = await User.findById(id);
    restaurant.approval = 'rejected';
    await restaurant.save();
    res.json({ message: 'rejected' });

  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Fetch user details
app.get('/fetch-user-details/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);

  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Fetch users
app.get('/fetch-users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);

  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Fetch restaurants
app.get('/fetch-restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);

  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Fetch orders
app.get('/fetch-orders', async (req, res) => {
  try {
    const orders = await Orders.find();
    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Fetch food items
app.get('/fetch-items', async (req, res) => {
  try {
    const items = await FoodItem.find();
    res.json(items);

  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Fetch categories
app.get('/fetch-categories', async (req, res) => {
  try {
    const data = await Admin.find();
    if (data.length === 0) {
      const newData = new Admin({ categories: [], promotedRestaurants: [] });
      await newData.save();
      return res.json(newData.categories);
    } else {
      return res.json(data[0].categories);
    }
  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
});

// Fetch promoted list
app.get('/fetch-promoted-list', async (req, res) => {
  try {
    const data = await Admin.find();
    if (data.length === 0) {
      const newData = new Admin({ categories: [], promotedRestaurants: [] });
      await newData.save();
      return res.json(newData.promotedRestaurants);
    } else {
      return res.json(data[0].promotedRestaurants);
    }
  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
});

// Fetch restaurant details with owner ID
app.get('/fetch-restaurant-details/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.params.id });
    res.json(restaurant);

  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Fetch restaurant details with restaurant ID
app.get('/fetch-restaurant/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    res.json(restaurant);

  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Fetch item details
app.get('/fetch-item-details/:id', async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id);
    res.json(item);

  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Add new product
app.post('/add-new-product', async (req, res) => {
  const { restaurantId, productName, productDescription, productMainImg, productCategory, productMenuCategory, productNewCategory, productPrice, productDiscount } = req.body;
  try {
    if (productMenuCategory === 'new category') {
      const admin = await Admin.findOne();
      admin.categories.push(productNewCategory);
      await admin.save();
      const newProduct = new FoodItem({ restaurantId, title: productName, description: productDescription, itemImg: productMainImg, category: productCategory, menuCategory: productNewCategory, price: productPrice, discount: productDiscount, rating: 0 });
      await newProduct.save();
      const restaurant = await Restaurant.findById(restaurantId);
      restaurant.menu.push(productNewCategory);
      await restaurant.save();
    } else {
      const newProduct = new FoodItem({ restaurantId, title: productName, description: productDescription, itemImg: productMainImg, category: productCategory, menuCategory: productMenuCategory, price: productPrice, discount: productDiscount, rating: 0 });
      await newProduct.save();
    }
    res.json({ message: "product added!!" });
  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
});

// Update product
app.put('/update-product/:id', async (req, res) => {
  const { restaurantId, productName, productDescription, productMainImg, productCategory, productMenuCategory, productNewCategory, productPrice, productDiscount } = req.body;
  try {
    if (productCategory === 'new category') {
      const admin = await Admin.findOne();
      admin.categories.push(productNewCategory);
      await admin.save();

      const product = await FoodItem.findById(req.params.id);

      product.title = productName;
      product.description = productDescription;
      product.itemImg = productMainImg;
      product.category = productCategory;
      product.menuCategory = productNewCategory;
      product.price = productPrice;
      product.discount = productDiscount;

      await product.save();
    } else {
      const product = await FoodItem.findById(req.params.id);

      product.title = productName;
      product.description = productDescription;
      product.itemImg = productMainImg;
      product.category = productCategory;
      product.menuCategory = productMenuCategory;
      product.price = productPrice;
      product.discount = productDiscount;

      await product.save();
    }
    res.json({ message: "product updated!!" });
  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
});

// Cancel order
app.put('/cancel-order', async (req, res) => {
  const { id } = req.body;
  try {
    const order = await Orders.findById(id);
    order.orderStatus = 'cancelled';
    await order.save();
    res.json({ message: 'order cancelled' });

  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
});

// Update order status
app.put('/update-order-status', async (req, res) => {
  const { id, updateStatus } = req.body;
  try {
    const order = await Orders.findById(id);
    order.orderStatus = updateStatus;
    await order.save();
    res.json({ message: 'order status updated' });

  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
});

// Fetch cart items
app.get('/fetch-cart', async (req, res) => {
  try {
    const items = await Cart.find();
    res.json(items);

  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
});

// Add to cart
app.post('/add-to-cart', async (req, res) => {
  const { userId, foodItemId, foodItemName, restaurantId, foodItemImg, price, discount, quantity } = req.body;
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    const item = new Cart({ userId, foodItemId, foodItemName, restaurantId, restaurantName: restaurant.title, foodItemImg, price, discount, quantity });
    await item.save();
    res.json({ message: 'Added to cart' });

  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
});

// Remove from cart
app.put('/remove-item', async (req, res) => {
  const { id } = req.body;
  try {
    const item = await Cart.deleteOne({ _id: id });
    res.json({ message: 'item removed' });

  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
});

// Order from cart
app.post('/place-cart-order', async (req, res) => {
  const { userId, name, mobile, email, address, pincode, paymentMethod, orderDate } = req.body;
  try {
    const cartItems = await Cart.find({ userId });
    for (const item of cartItems) {
      const newOrder = new Orders({
        userId, name, email, mobile, address, pincode, paymentMethod, orderDate,
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
        foodItemId: item.foodItemId,
        foodItemName: item.foodItemName,
        foodItemImg: item.foodItemImg,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount
      });
      await newOrder.save();
      await Cart.deleteOne({ _id: item._id });
    }
    res.json({ message: 'Order placed' });

  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
