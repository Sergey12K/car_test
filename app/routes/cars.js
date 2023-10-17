const express = require('express');
const router = express.Router();
const { Car } = require('../models');


router.get('/', (req, res) => {
    res.send('<h2>Машины</h2>');
});

router.post('/', async (req, res) => {
    try {
          const { VIN, modelId, brandId } = req.body;
          console.log(VIN, modelId, brandId)
  
      const car = await Car.create({
        VIN,
        modelId,
        brandId,
             });
  
      // Отправьте успешный ответ
      res.status(201).json({ message: 'Автомобиль успешно добавлен', car });
    } catch (error) {
      console.error('Ошибка при добавлении автомобиля:', error);
      res.status(500).json({ error: 'Ошибка при добавлении автомобиля' });
    }
  });
  


module.exports = router;