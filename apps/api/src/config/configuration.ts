export default () => ({
  // Server
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key-change-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  // Mercado Pago
  mercadoPago: {
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY,
    environment: process.env.MERCADO_PAGO_ENVIRONMENT || 'sandbox',
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'noreply@codemarket.com',
  },

  // Upload
  upload: {
    maxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE, 10) || 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'application/msword'],
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
  },

  // Features
  features: {
    enableRegistration: process.env.ENABLE_REGISTRATION !== 'false',
    enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
    enableReviews: process.env.ENABLE_REVIEWS !== 'false',
    enableWishlist: process.env.ENABLE_WISHLIST !== 'false',
    enableNotifications: process.env.ENABLE_NOTIFICATIONS !== 'false',
  },

  // Marketplace
  marketplace: {
    name: process.env.MARKETPLACE_NAME || 'CodeMarket',
    commission: parseFloat(process.env.MARKETPLACE_COMMISSION) || 0.1,
    currency: process.env.MARKETPLACE_CURRENCY || 'BRL',
    freeShippingThreshold: parseFloat(process.env.FREE_SHIPPING_THRESHOLD) || 199.99,
  },

  // Security
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5,
    lockoutTime: parseInt(process.env.LOCKOUT_TIME, 10) || 15 * 60 * 1000, // 15 minutes
  },

  // CORS
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL?.split(',') || []
      : ['http://localhost:3000'],
  },
});
