// Central place for test credentials. Values come from environment variables,
// loaded from the git-ignored .env file at the project root (see .env.example).
const path = require('path');

try {
    process.loadEnvFile(path.resolve(__dirname, '..', '.env'));
} catch (e) {
    if (e.code !== 'ENOENT') throw e;   // no .env is fine (e.g. CI sets real env vars)
}

function env(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable ${name}. Copy .env.example to .env and fill it in.`);
    }
    return value;
}

// Replaces "${VAR}" placeholders (used in .feature files and JSON test data) with env values.
// Works on strings, arrays and plain objects.
function resolveEnv(data) {
    if (typeof data === 'string') return data.replace(/\$\{(\w+)\}/g, (_, name) => env(name));
    if (Array.isArray(data)) return data.map(resolveEnv);
    if (data && typeof data === 'object') {
        return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, resolveEnv(v)]));
    }
    return data;
}

module.exports = { env, resolveEnv };
