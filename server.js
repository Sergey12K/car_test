const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')
const bodyParser = require('body-parser')
const errorHandler = require('./app/middleware/ErrorHandlingMiddleware')

dotenv.config();



// Connect to MongoDB
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// Обработка события ошибки подключения
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Обработка события отключения от базы данных
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Закрытие соединения с базой данных при завершении приложения 
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при закрытии соединения с MongoDB:', error);
    process.exit(1); 
  }
});

async function getCarInfoByVIN(VIN) {
  try {
    const carInfo = await prisma.Cars.findFirst({ where: { OR: [{VIN }] },});
    console.log(carInfo)

  if (!carInfo) {
    throw new Error('Автомобиль не найден');
  }

  // Ищем координаты по VIN в MongoDB
  const CarSchema = mongoose.model('CarSchema'); // Подключаем модель для MongoDB
  const coordinates = await CarSchema.findOne({ VIN });

  if (!coordinates) {
    throw new Error('Координаты не найдены');
  }

  // Объединяем информацию о машине и координаты
  const result = {
    VIN: carInfo.VIN,
    modelId: carInfo.modelId,
    brandId: carInfo.brandId,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  };

  return result;
} catch (error) {
  console.error('Ошибка при запросе информации о машине:', error);
  throw error;
} finally {
  
  mongoose.disconnect();
}
}


const app = express();
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

//Обработка ошибок
app.use(errorHandler)



app.get('/', (req, res) => {
    res.send('<h2>Главная страница</h2>');
});

app.get('/cars/:VIN', async (req, res) => {
  const { VIN } = req.params;

  try {
       const result = await getCarInfoByVIN(VIN);

    
    res.json(result);
  } catch (error) {
    console.error('Ошибка при выполнении поиска:', error);
    res.status(500).json({ error: 'Ошибка при выполнении поиска' });
  }
});


// Routes
const carsRouter = require('./app/routes/cars');
const userRouter = require('./app/routes/userRouter');
const coordinatesRouter = require('./app/routes/coordinates')
const authMiddleware = require('./app/middleware/auth');


app.use('/cars', authMiddleware, carsRouter);
app.use('/api/user', userRouter);
app.use('/coordinates', authMiddleware, coordinatesRouter);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Initialize PostgreSQL database connection
async function main() {
  try {
    await prisma.$connect();
    console.log('Postgres database connected');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  throw e;
});
