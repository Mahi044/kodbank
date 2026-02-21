const chat = async (req, res) => {
    const { message } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({ message: 'Message is required.' });
    }

    const HF_API_KEY = process.env.HF_API_KEY;
    const HF_MODEL_ID = process.env.HF_MODEL_ID || 'Qwen/Qwen2.5-72B-Instruct';

    if (!HF_API_KEY) {
        return res.status(500).json({ message: 'Hugging Face API key is not configured.' });
    }

    const systemPrompt = `You are KodBank Assistant, a helpful and friendly AI assistant for the KodBank banking application. You help users with their banking queries, account information, and general financial guidance. Keep your responses concise, professional, and helpful. If asked about specific account details you don't have access to, politely let the user know to check their dashboard.`;

    try {
        const response = await fetch(
            'https://router.huggingface.co/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: HF_MODEL_ID,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: message },
                    ],
                    max_tokens: 512,
                    temperature: 0.7,
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Hugging Face API error:', response.status, errorData);
            return res.status(502).json({
                message: 'Failed to get response from AI model.',
                error: errorData.error || 'Unknown error',
            });
        }

        const data = await response.json();

        let reply = '';
        if (data.choices && data.choices.length > 0) {
            reply = data.choices[0].message?.content || '';
        } else {
            reply = 'Sorry, I could not generate a response. Please try again.';
        }

        reply = reply.trim();
        res.json({ reply });
    } catch (error) {
        console.error('Chat controller error:', error);
        res.status(500).json({ message: 'Internal server error while processing chat.' });
    }
};

module.exports = { chat };
