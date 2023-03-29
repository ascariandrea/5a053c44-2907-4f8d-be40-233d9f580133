declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly DB_USER: string;
    readonly DB_PASSWORD: string;
    readonly DB_NAME: string;
    readonly DB_PORT: number;
    readonly PORT: number;
    readonly JWT_SECRET: string;
  }
}
