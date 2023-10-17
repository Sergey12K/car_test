const express = require('express');
const router = express.Router();
const { CarModel } = require('../models/carSchema')


router.get('/', (req, res) => {
    res.send('<h2>Координаты</h2>');
});

router.post('/', async (req, res) => {
    try {
          const { VIN, latitude, longitude } = req.body;
          console.log(VIN, latitude,longitude)
  
      const carCoordinates = await CarModel.create({
        VIN,
        latitude,
        longitude,
             });
  
      // Отправьте успешный ответ
      res.status(201).json({ message: 'Координаты успешно добавлены', carCoordinates });
    } catch (error) {
      console.error('Ошибка при добавлении координат:', error);
      res.status(500).json({ error: 'Ошибка при добавлении координат' });
    }
  });
  


module.exports = router;