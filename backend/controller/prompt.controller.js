import OpenAI from "openai";
import dotenv from "dotenv";
import { ChatMessage } from "../model/prompt.model.js";

dotenv.config();

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENAI_API_KEY,
});



export const sendPrompt = async (req, res) => {
    const { content } = req.body;
    const userId = req.userId;

    if (!content || content.trim() === "") {
        return res.status(400).json({ errors: "Prompt content is required" });
    }

    try {
        // save the user prompt
        await ChatMessage.create({
            userId,
            role: "user",
            content,
        });

        // api call
        const completion = await openai.chat.completions.create({
            model: "z-ai/glm-4.5",
            messages: [{ role: "user", content }],
            max_tokens: 1000,
        });

        const aiContent = completion.choices[0].message.content;

        // save assistant pompt
        await ChatMessage.create({
            userId,
            role: "assistant",
            content: aiContent,
        });


        return res.status(200).json({ reply: aiContent });
    } catch (err) {
        console.error("Error in prompt:", err);
        return res.status(500).json({ errors: "Something went wrong with the AI response" });
    }
};