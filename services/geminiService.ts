
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an enticing, sensory-focused summary for a dish.
 */
export const getDishSummary = async (dishName: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a world-class food critic. Describe why someone would crave the dish "${dishName}" ("${description}") in exactly one short, punchy, sensory-rich sentence. Focus on textures and primary flavors. Do not use hashtags or emojis.`,
    });
    return response.text || "A masterfully crafted flavor experience.";
  } catch (error) {
    console.error("Gemini Error (Dish Summary):", error);
    return "A chef-recommended signature dish.";
  }
};

/**
 * Summarizes customer sentiment into a "Vibe Check" and a "Verdict".
 */
export const getReviewSummary = async (restaurantName: string, reviews: { rating: number; comment: string }[]) => {
  if (reviews.length === 0) return { summary: "No reviews yet. Be the first to share your experience!", verdict: "New Arrival" };
  
  const reviewsText = reviews.map(r => `[Rating: ${r.rating}/5]: ${r.comment}`).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these reviews for "${restaurantName}". 
      1. Summarize the general 'vibe' in 15 words or less.
      2. Provide a 2-word 'Verdict' (e.g., "Hidden Gem", "Crowd Favorite").
      Return format: "VIBE: [Summary] | VERDICT: [Verdict]"`,
      config: { temperature: 0.7 }
    });
    
    const parts = response.text?.split('|') || [];
    const vibe = parts[0]?.replace('VIBE:', '').trim() || "Consistently praised for quality and service.";
    const verdict = parts[1]?.replace('VERDICT:', '').trim() || "Local Favorite";
    
    return { summary: vibe, verdict };
  } catch (error) {
    return { summary: "Consistently positive feedback across the board.", verdict: "Highly Rated" };
  }
};

/**
 * Provides a personalized recommendation based on the user's favorites.
 */
export const getPersonalizedPick = async (favoriteRestaurantNames: string[], allRestaurants: { name: string; cuisine: string; description: string }[]) => {
  if (favoriteRestaurantNames.length === 0) return null;

  const restaurantsList = allRestaurants.map(r => `${r.name} (${r.cuisine}: ${r.description})`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User loves: ${favoriteRestaurantNames.join(', ')}. 
      From this list, pick the ONE most similar/complementary restaurant the user hasn't favorited:
      ${restaurantsList}
      
      Explain why in 10 words. 
      Return format: "RESTAURANT_NAME | REASON"`,
    });
    const text = response.text || "";
    const [name, reason] = text.split('|').map(s => s.trim());
    return { name, reason };
  } catch (error) {
    return null;
  }
};

/**
 * Generates smart order note suggestions based on cart contents.
 */
export const suggestOrderNotes = async (dishNames: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `For an order containing: ${dishNames.join(', ')}, suggest 3 common short kitchen instructions or preferences (max 3 words each). Return as a simple comma-separated list.`,
    });
    return response.text?.split(',').map(s => s.trim().replace('.', '')) || ["Extra sauce", "No cutlery", "Spicy"];
  } catch (error) {
    return ["Extra napkins", "Well done", "Less salt"];
  }
};

/**
 * Analyzes order history to create a "Taste Profile" for the user.
 */
export const generateTasteProfile = async (orderItems: string[]) => {
  if (orderItems.length === 0) return "Explore some restaurants to discover your taste profile!";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these past orders: ${orderItems.join(', ')}, summarize the user's food personality in 3 evocative words (e.g., "The Adventurous Foodie", "The Comfort Craver"). Then add a 10-word description of their palate.`,
    });
    return response.text || "The Balanced Epicurean: Someone who enjoys a wide variety of textures and international cuisines.";
  } catch (error) {
    return "A lover of fine flavors and diverse culinary experiences.";
  }
};
