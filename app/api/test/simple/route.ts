export const runtime = 'edge';

export async function GET() {
    return new Response(JSON.stringify({
        message: "Simple Test Alive",
        env_node_version: process.env.NODE_VERSION,
        has_api_key: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
