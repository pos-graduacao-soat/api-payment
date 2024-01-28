export const env = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017',
  port: process.env.PORT || 3000,
  ordersApiUrl: process.env.ORDERS_API_URL || '',
}