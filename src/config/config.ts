import "dotenv/config";

function env(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

export const config = {
    port: Number(process.env.PORT ?? 8080),

    db: {
        url: env("DATABASE_URL"),
    },

    retentionDays: Number(process.env.RETENTION_DAYS ?? 30),
};