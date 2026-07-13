// config/configuration.ts — Load and validate env variables
export default () => ({
  port: parseInt(process.env.PORT || "3000", 10),
  appUrl: process.env.APP_URL || "http://localhost:3000",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3001",

  database: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "access-secret-change-me",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "refresh-secret-change-me",
    accessExpires: process.env.JWT_ACCESS_EXPIRES || "15m",
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || "30d",
  },

  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    chatModel: process.env.OPENAI_CHAT_MODEL || "gpt-4o",
  },

  googleTts: {
    // Credentials JSON được set qua GOOGLE_APPLICATION_CREDENTIALS (path) hoặc GOOGLE_TTS_CREDENTIALS_JSON (inline, cho Railway)
    credentialsJson: process.env.GOOGLE_TTS_CREDENTIALS_JSON,
  },

  chatLimits: {
    freeMessagesPerDay: parseInt(process.env.CHAT_FREE_LIMIT || "10", 10),
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  vnpay: {
    tmnCode: process.env.VNPAY_TMN_CODE,
    secretKey: process.env.VNPAY_SECRET_KEY,
    url: process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  },

  pricing: {
    premiumVnd: parseInt(process.env.PRICE_PREMIUM_VND || "99000", 10),
    proVnd: parseInt(process.env.PRICE_PRO_VND || "199000", 10),
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromName: process.env.SMTP_FROM_NAME || "AI Language Platform",
    fromEmail: process.env.SMTP_FROM_EMAIL || "no-reply@ailanguage.com",
  },

  sentry: {
    dsn: process.env.SENTRY_DSN,
  },

  cookie: {
    // Domain gốc để cookie share được giữa FE (www.flueni.id.vn) và BE (api.flueni.id.vn)
    // Để trống ở local dev — browser tự dùng domain hiện tại
    domain: process.env.COOKIE_DOMAIN || undefined,
    secure: process.env.NODE_ENV === "production",
  },

  vapid: {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
    subject: process.env.VAPID_SUBJECT || "mailto:admin@flueni.id.vn",
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
});
