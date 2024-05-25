const express = require('express');
const weatherRoutes = require('./routes/weather');
const mailRoutes = require('./routes/mail');
const app = express();

require('dotenv').config();

app.use(express.json());
app.use('/api', weatherRoutes);
app.use('/api', mailRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});