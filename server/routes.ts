import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

const generateReplySchema = z.object({
  email: z.string().min(10, "Email content must be at least 10 characters"),
  tone: z.enum(["professional", "friendly", "apologetic", "enthusiastic", "concise", "detailed", "diplomatic"]),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate email reply endpoint
  app.post("/api/generate-reply", async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Validate request body
      const { email, tone } = generateReplySchema.parse(req.body);
      
      // Get API key from environment
      const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY || process.env.API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ 
          message: "API key not configured. Please set OPENROUTER_API_KEY environment variable." 
        });
      }
      
      // Prepare the prompt based on tone
      const toneInstructions = {
        professional: "Write a professional, formal reply that maintains business etiquette and clear communication.",
        friendly: "Write a warm, friendly reply that sounds approachable and personable while remaining appropriate.",
        apologetic: "Write a reply that expresses regret, understanding, or takes responsibility where appropriate.",
        enthusiastic: "Write an energetic, positive reply that shows excitement and engagement.",
        concise: "Write a brief, to-the-point reply that covers all necessary information efficiently.",
        detailed: "Write a comprehensive, thorough reply that provides detailed information and context.",
        diplomatic: "Write a tactful, careful reply that navigates sensitive topics with consideration.",
      };
      
      const prompt = `${toneInstructions[tone as keyof typeof toneInstructions]}

Please write a reply to this email:

${email}

Instructions:
- Keep the reply natural and human-like
- Match the appropriate tone and formality level
- Include a proper greeting and closing
- Address the main points from the original email
- Make it ready to send (no placeholders or brackets)`;

      // Make request to OpenRouter with DeepSeek model
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : "http://localhost:5000",
          "X-Title": "ReplyGen - AI Email Reply Generator"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are an expert email assistant. Generate professional, contextual email replies that sound natural and human-like. Always maintain the appropriate tone and formality level."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("OpenRouter API Error:", response.status, errorData);
        
        if (response.status === 401) {
          return res.status(500).json({ 
            message: "Invalid API key. Please check your OpenRouter configuration." 
          });
        } else if (response.status === 429) {
          return res.status(429).json({ 
            message: "Rate limit exceeded. Please try again in a moment." 
          });
        } else {
          return res.status(500).json({ 
            message: `AI service error: ${errorData.error?.message || 'Unknown error'}` 
          });
        }
      }

      const data = await response.json();
      const generatedReply = data.choices?.[0]?.message?.content;
      
      if (!generatedReply) {
        return res.status(500).json({ 
          message: "Failed to generate reply. Please try again." 
        });
      }

      // Calculate stats
      const endTime = Date.now();
      const generationTime = ((endTime - startTime) / 1000).toFixed(1) + "s";
      const words = generatedReply.trim().split(/\s+/).length;
      const characters = generatedReply.length;

      res.json({
        reply: generatedReply.trim(),
        stats: {
          words,
          characters,
          generationTime,
        }
      });

    } catch (error) {
      console.error("Generate reply error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: error.errors[0]?.message || "Invalid request data" 
        });
      }
      
      res.status(500).json({ 
        message: "Internal server error. Please try again." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
