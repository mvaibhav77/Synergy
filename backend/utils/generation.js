import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_API_KEY = process.env.GEMINI_API_KEY; // Replace with your actual Google API key

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateWelcomeMessage = async (userDetails) => {
  const prompt = `Craft a warm and engaging introductory message for someone who has just sent a connection request on social media. The purpose of this message is to act as an icebreaker and foster productive communication and potential collaboration.

  Ensure the message includes:
  - The sender's name.
  - The sender's interests and what they are passionate about.
  - A brief mention of the sender’s skills.
  - A polite invitation for the recipient to share details about themselves, including their own interests and professional background.
  
  The tone should be friendly, genuine, and open, setting the stage for a positive interaction. Rephrase the following message in the above format and **return the final message without placeholders or filler words like '[add recipients interests]'**. If any information is missing, **improvise naturally** to fill the gaps, and ensure the message remains short and engaging. Here's the message to rephrase:
  
  "Hi there! I'm ${userDetails.name}. I recently sent you a connection request because I'm deeply passionate about ${userDetails.interests} and have skills in ${userDetails.skills}. I noticed that you might have interests in ${userDetails.connectionPreferences.interests}, and I believe there could be some great opportunities for us to collaborate. I would love to learn more about you, your work, and what drives you. Feel free to share a bit about yourself—I’m excited to connect and explore how we can support each other!"`;

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

export { generateWelcomeMessage };
