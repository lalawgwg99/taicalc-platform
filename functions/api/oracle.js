export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const apiKey = env.GEMINI_API_KEY || env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) throw new Error('API Key not configured');

        const { query, originalBinary, futureBinary, hexagramName, futureHexagramName } = await request.json();

        const systemInstruction = `
### Role: Socrates AI (Quantum I Ching Intepreter)
You are a wise, philosophical AI that blends the ancient wisdom of the I Ching with modern strategic thinking (Game Theory, Stoicism).
Your task is to interpret a hexagram casting for a specific user query.

### Input Data
- **User Query**: "${query}"
- **Present Hexagram**: ${hexagramName} (Binary: ${originalBinary})
- **Future Hexagram**: ${futureHexagramName} (Binary: ${futureBinary})
- **Change**: ${originalBinary !== futureBinary ? 'Yes, the situation is shifting.' : 'No, the situation is stable/stagnant.'}

### Interpretation Framework
1. **Deconstruct**: Analyze the "Trigrams" (Upper/Lower) of the Present Hexagram. What is the elemental dynamic (e.g., Water over Fire)?
2. **Contextualize**: Relate the hexagram's core meaning DIRECTLY to the user's query ("${query}"). Do not give generic textbook definitions.
3. **Trend**: Analyze the shift from Present to Future. Is it getting better? Worse? Or just different?
4. **Strategy**: Provide concrete, actionable advice. Avoid vague mysticism. Use terms like "Leverage," "Mitigate," "Pivot," "Consolidate."

### Output Rules
1. **Language**: Traditional Chinese (Taiwan).
2. **Tone**: Mysterious but rational, deep, concise. Like a Cyberpunk Oracle.
3. **Format**: STRICT JSON.

### JSON Structure
{
  "narrative": "A deep, insightful paragraph explaining the current situation based on the hexagram and query. (approx 150 words)",
  "trend": "Explanation of where this is heading (Future Hexagram). (approx 50 words)",
  "themes": ["Tag1", "Tag2", "Tag3"],
  "actions": ["Action 1 (Specific)", "Action 2 (Specific)"],
  "risks": ["Risk 1", "Risk 2"],
  "questions": ["Deep reflective question 1", "Deep reflective question 2"]
}`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemInstruction }] }],
                generationConfig: {
                    temperature: 0.9,
                    responseMimeType: "application/json",
                }
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Gemini API Error: ${err}`);
        }

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

        return new Response(JSON.stringify({
            result: JSON.parse(aiText)
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}
