import 'reflect-metadata';

// Configuração do ambiente para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';
process.env.AUTH_APP_URL = 'http://auth-api'