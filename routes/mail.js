const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { Weather } = require('../models');
const router = express.Router();

router.post('/SendEmail', async (req, res) => {
  const cities = req.body;
  const emailRecipient = 'soumya10507@gmail.com'; 

  try {
    let emailContent = `
      <h1>Weather Data</h1>
      <table border="1">
        <tr>
          <th>City</th>
          <th>Country</th>
          <th>Weather</th>
          <th>Time</th>
          <th>Longitude</th>
          <th>Latitude</th>
        </tr>
    `;

    for (const cityInfo of cities) {
      
      const geoResponse = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${cityInfo.city}&country=${cityInfo.country}`, {
        headers: { 'X-Api-Key': process.env.GEOCODING_API_KEY }
      });
      const { latitude, longitude } = geoResponse.data[0];

      
      const weatherResponse = await axios.get(`https://weatherapi-com.p.rapidapi.com/current.json?q=${latitude},${longitude}`, {
        headers: { 'X-RapidAPI-Key': process.env.WEATHER_API_KEY }
      });
      const weather = weatherResponse.data.current.condition.text;
      const time = new Date();

      // Append to email content
      emailContent += `
        <tr>
          <td>${cityInfo.city}</td>
          <td>${cityInfo.country}</td>
          <td>${weather}</td>
          <td>${time}</td>
          <td>${longitude}</td>
          <td>${latitude}</td>
        </tr>
      `;
    }

    emailContent += `</table>`;

   
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailRecipient,
      subject: 'Weather Data',
      html: emailContent,
    });

    res.send('Weather data emailed successfully.');
  } catch (error) {
    console.error(error);
    res.send('An error occurred while emailing weather data.');
  }
});

module.exports = router;