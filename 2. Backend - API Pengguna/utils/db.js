const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/coba')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Connection error:', err));


