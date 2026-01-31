// Debug endpoint to see what env variables are available
export async function onRequest(context) {
    const { env } = context;

    return new Response(
        JSON.stringify({
            hasEnv: !!env,
            envKeys: env ? Object.keys(env) : [],
            R2_BUCKET_NAME: env?.R2_BUCKET_NAME || 'undefined',
            R2_ACCOUNT_ID: env?.R2_ACCOUNT_ID || 'undefined',
            NODE_ENV: env?.NODE_ENV || 'undefined',
        }, null, 2),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );
}
