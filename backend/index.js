const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const app = express();

require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;

// ✅ Setup CORS first
app.use(cors({
    origin: "http://localhost:3000",  // frontend origin
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

app.use(bodyParser.json());

// Routes
app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
