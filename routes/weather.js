const express = require('express');
const axios = require('axios');
const { Weather } = require('../models');
const router = express.Router();

router.post('/SaveWeatherMapping', async (req, res) => {
  const cities = req.body;

  try {
    for (const cityInfo of cities) {
      
      const geoResponse = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${cityInfo.city}&country=${cityInfo.country}`,
       {
        headers: { 'X-Api-Key': process.env.GEOCODING_API_KEY }}
    );
      const { latitude, longitude } = geoResponse.data[0];

      
      const weatherResponse = await axios.get(`https://weatherapi-com.p.rapidapi.com/current.json?q=${latitude},${longitude}`, 
      {
        headers: { 'X-RapidAPI-Key': process.env.WEATHER_API_KEY }
      }
    );
      const weather = weatherResponse.data.current.condition.text;
      const time = new Date();

      // Save weather data to database
      await Weather.create({
        city: cityInfo.city,
        country: cityInfo.country,
        weather,
        time,
        longitude,
        latitude,
      });
    }
    res.send('Weather data saved successfully.');
  } catch (error) {
    console.error(error);
    res.send('An error occurred while fetching or saving weather data.');
  }
});

module.exports = router;