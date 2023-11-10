import express from 'express';
import fetch from 'node-fetch';
import OpenAI from 'openai';

const app = express();
const port = 3000;

const openaiApiKey = "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";
const openai = new OpenAI({ apiKey: openaiApiKey });

app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

async function generateResponse(prompt) {
    try {
        const response = await fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`,
            } ,
            body: JSON.stringify({
                // model:"text-davinci-002",
                prompt: prompt,
                max_tokens: 150,
                temperature: 0.7,
            }),
        });

        const responseData = await response.json();
        console.log(responseData);
        return responseData.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating response:', error.message);
        return 'An error occurred while generating the response.';
    }
}

app.post('/chatbot', async (req, res) => {
    const userMessage = "dates";
    const userLocation = "london";
    const prompt =` Find locations near ${userLocation} for ${userMessage}`;
    const botResponse = await generateResponse(prompt);
    const response = { message: botResponse };
    console.log(response);
    res.json(response);
});

app.get("/chatbot", (req, res) => {
    res.render("home");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});