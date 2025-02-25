import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_API_KEY = process.env.GEMINI_API_KEY; // Replace with your actual Google API key

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateWelcomeMessage = async (userDetails) => {
  const prompt = `
  You are an AI responsible for crafting introductory messages for connection requests on social media. Your task is to write a warm and engaging message, personalized to foster communication and potential collaboration.

Ensure the message includes:

The sender’s name.
Their interests and skills.
If any information about the sender’s interests, skills, or background is missing, fill in the details naturally without placeholders (e.g., "I'm passionate about web development" instead of "[Mention sender's interests]").
A polite invitation for the recipient to share more about themselves, their work, and their interests.
Here is the message to be rephrased without placeholders or incomplete sentences:

"Hi there! I'm ${userDetails.name}. I recently sent you a connection request because I'm deeply passionate about ${userDetails.interests} and have skills in ${userDetails.skills}. I noticed that you might have interests in ${userDetails.connectionPreferences.interests}, and I believe there could be some great opportunities for us to collaborate. I would love to learn more about you, your work, and what drives you. Feel free to share a bit about yourself—I’m excited to connect and explore how we can support each other!"

Important: The final message must not include placeholders like "[mention sender's interests]." If any information is missing, you should improvise appropriately to keep the message engaging and natural. The message should be ready to send as-is.`;

  console.log(prompt);
  try {
    const result = await model.generateContent(prompt);
    // Return the generated message text from Google Generative AI
    console.log(result.response.text());
    return result.response.text().trim();
  } catch (error) {
    console.error(
      "Error generating message:",
      error.response ? error.response.data : error.message
    );
    return "Hi! I sent you a connection request and am looking forward to connecting!";
  }
};

const generateAIReplies = async (previousMessages) => {
  const prompt = `
Analyze the following conversation and draft a friendly, engaging response. The response must not include placeholders like '[mention sender's interests]' and should be ready to send as-is, without requiring any further edits. Use the context of the conversation to generate a natural, thoughtful reply that reflects the tone and flow of the discussion.

The conversation is: ${previousMessages}`;
  console.log(prompt);
  try {
    const result = await model.generateContent(prompt);
    // Return the generated message text from Google Generative AI
    console.log(result.response.text());
    return result.response.text().trim();
  } catch (error) {
    console.error(
      "Error generating message:",
      error.response ? error.response.data : error.message
    );
    return "";
  }
};

export { generateWelcomeMessage, generateAIReplies };
