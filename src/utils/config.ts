const Config = {
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'App Name',
    publicUrl: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
    databaseUrl: process.env.DATABASE_URL || '',
    apiRoute: 'api',
    appEnv: process.env.APP_ENV || 'development',

};

export default Config
