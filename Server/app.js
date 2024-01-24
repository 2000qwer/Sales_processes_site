const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const config = require('./config/default.json');  // Load the config object
const User = require('./models/User');
const Sales = require('./models/Sales');
var cors = require('cors');  // Import the cors middleware
const auth = require('./middleware/auth'); 
const router = express.Router();
const { ObjectId } = require('mongodb');




const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(router);
// Connect to MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Listen for successful connection
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Listen for connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});


// Middleware for parsing JSON
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// getting infomration about sales
router.get('/api/sales', async (req, res) => {
  try {
    // Fetch all sales from the database
    const sales = await Sales.find();
    // Send the sales data in the response
    res.status(200).json({ sales });
  } catch (error) {
    console.error('Error fetching sales data:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Adding sales data into database
app.post('/api/sales', async (req, res) => {
  const {
    item_id,
    status,
    created_at,
    sku,
    price,
    qty_ordered,
    grand_total,
    increment_id,
    categoryName,
    discount_amount,
    payment_method,
    Working_Date,
    BI_Status,
    Customer_ID,
    email
  } = req.body;
  console.log(req.headers)
  try {
    const grand_total = qty_ordered * (price - discount_amount);
    // Create a new sale
    const newSale = new Sales({
      item_id,
      status,
      created_at,
      sku,
      price,
      qty_ordered,
      grand_total,
      increment_id,
      categoryName,
      discount_amount,
      payment_method,
      Working_Date,
      BI_Status,
      Customer_ID,
      email
    });
    console.log(newSale.Customer_ID);
    console.log(newSale.sku);
    console.log(newSale.BI_Status);   
    console.log(newSale.email);

    // const mial = 'test02@gmial.com';
    // newSale.email = mial
    // Save the sale to the database
    await newSale.save();

    // Return the sale information in the response
    res.status(201).json({
      message: 'Sale added successfully',
     
    });
  } catch (error) {
    console.error('Error adding sale:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/api/sales/lineChartData', async (req, res) => {
  try {
    // Replace this with your actual logic to fetch data for the year 2017
    const lineChartData2017 = await Sales.find({ year: 2017 });

    res.json({  lineChartData2017  });
  } catch (error) {
    console.error('Error fetching line chart data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/api/sales/payment-methods', async (req, res) => {
  try {
    // Fetch distinct payment methods from the database
    const paymentMethods = await Sales.distinct('payment_method', { payment_method: { $ne: '' } });
    res.status(200).json({ paymentMethods });
  } catch (error) {
    console.error('Error fetching payment methods:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/api/sales/bi-status-list', async (req, res) => {
  try {
    const distinctBiStatusList = await Sales.distinct('BI_Status', { BI_Status: { $ne: '' } });
    console.log(distinctBiStatusList)
    res.status(200).json({ biStatusList: distinctBiStatusList });
  } catch (error) {
    console.error('Error fetching distinct bi_status values:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/api/sales/status-list', async (req, res) => {
  try {
    // Fetch distinct status values from the database
    const statusList = await Sales.distinct('status', { status: { $ne: '' } });
    console.log('Status List:', statusList); 
    res.status(200).json({ statusList });
  } catch (error) {
    console.error('Error fetching status list:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});



router.get('/api/sales/category-names', async (req, res) => {
  try {
    // Fetch distinct category names from the database
    const categoryNames = await Sales.distinct('categoryName', { categoryName: { $ne: '' } });
    res.status(200).json({ categoryNames });
  } catch (error) {
    console.error('Error fetching category names:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});









app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });

    // Return the user information and token in the response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        // Add other user information as needed
      },
      token,
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});








app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, name: user.name, email: user.email }, config.jwtSecret, { expiresIn: '1h' });

    // Send user information along with the token
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        // Add other user information as needed
      },
    });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.get('/api/user', async (req, res) => {
  try {
    // Extract the user ID from the token in the request header
    const token = req.header('x-auth-token');
    const decoded = jwt.verify(token, config.jwtSecret);

    // Find the user by ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user information in the response
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        // Add other user information as needed
      },
    });
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/user/:userId', auth, async (req, res) => {
  const userId = req.params.userId;
  const { name, email } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name;
    user.email = email;

    await user.save();

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// const express = require('express');
// const cache = require('memory-cache'); // Import the caching library

// // ... (Other imports and middleware)

// // Middleware to cache responses for a specific route
// const cacheMiddleware = (duration) => {
//   return (req, res, next) => {
//     const key = '__express__' + req.originalUrl || req.url;
//     const cachedBody = cache.get(key);

//     if (cachedBody) {
//       res.send(cachedBody);
//       return;
//     } else {
//       res.sendResponse = res.send;
//       res.send = (body) => {
//         cache.put(key, body, duration * 1000); // Cache for the specified duration in seconds
//         res.sendResponse(body);
//       };
//       next();
//     }
//   };
// };

// // Use the cacheMiddleware for the sales route
// router.get('/api/sales', cacheMiddleware(60), async (req, res) => {
//   try {
//     // Fetch all sales from the database
//     const sales = await Sales.find();

//     // Send the sales data in the response
//     res.status(200).json({ sales });
//   } catch (error) {
//     console.error('Error fetching sales data:', error.message);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // ... (Other routes)

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });