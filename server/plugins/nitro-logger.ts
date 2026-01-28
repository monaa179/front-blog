import fs from 'fs';
import path from 'path';

export default defineNitroPlugin((nitroApp) => {
    const logPath = path.resolve(process.cwd(), 'nuxt-server.log');
    const stream = fs.createWriteStream(logPath, { flags: 'a' });

    const write = (level: string, args: any[]) => {
        const msg = args
            .map(a => a instanceof Error ? a.stack : (typeof a === 'object' ? JSON.stringify(a) : String(a)))
            .join(' ');

        stream.write(
            `[${new Date().toISOString()}] [${level}] ${msg}\n`
        );
    };

    // Capture tous les console.log/warn/error
    console.error = (...args) => write('ERROR', args);
    console.warn = (...args) => write('WARN', args);
    console.log = (...args) => write('INFO', args);

    // 🔥 Hook Nitro - capture TOUTES les erreurs API/SSR automatiquement
    nitroApp.hooks.hook('error', (error, { event }) => {
        write('ERROR', [
            '🔥 NITRO ERROR',
            'URL:', event?.node?.req?.url || 'unknown',
            'METHOD:', event?.node?.req?.method || 'unknown',
            error
        ]);
    });

    // Catch des Promises non gérées (sinon silence total)
    process.on('unhandledRejection', (reason) => {
        write('ERROR', ['🔥 UNHANDLED REJECTION', reason]);
    });

    process.on('uncaughtException', (err) => {
        write('ERROR', ['🔥 UNCAUGHT EXCEPTION', err]);
    });
});
