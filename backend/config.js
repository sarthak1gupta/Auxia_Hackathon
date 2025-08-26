module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://hgupta2505:7FcCSVhUFYPjMyN1@cluster0.runupqc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  JWT_SECRET: process.env.JWT_SECRET || 'auxia_jwt_secret_key_2024',
  NODE_ENV: process.env.NODE_ENV || 'development'
};