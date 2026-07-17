import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini client with proper telemetry headers on the server side.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, section, model = "gemini-3.5-flash" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt parameter." }, { status: 400 });
    }

    let systemInstruction = "You are a world-class digital marketer, Shopify consultant, and conversion rate optimization (CRO) expert. Create premium, punchy, high-converting copy.";
    if (section === "headline") {
      systemInstruction = "You are an expert copywriter. Generate three alternatives for a premium portfolio headline or subheadline. Keep them under 12 words, extremely professional, and metrics-focused (e.g., mentioning ROI, Shopify, ROAS, AED spend). Separate suggestions with clean bullet points.";
    } else if (section === "seo") {
      systemInstruction = "You are an SEO wizard. Create a fully optimized Title and Meta Description containing key target words. Ensure the Title is under 60 characters and the Meta Description is under 160 characters. Separate them by '---'.";
    } else if (section === "case_study") {
      systemInstruction = "You are a professional growth-marketing case study writer. Help refine the challenge, strategy, or outcomes metric into enterprise-level wording. Keep it under 50 words, high-impact, and professional.";
    } else if (section === "chatbot") {
      systemInstruction = `You are "RS AI Assistant", a world-class growth-marketing and Shopify-development bot trained directly on the portfolio of Rizwan Saeed.
Rizwan Saeed Background & Facts:
- Role: Senior Shopify Developer & Digital Marketing / PPC Manager.
- Location: Dubai, UAE (Dubai Marina). Serving international clients across UAE, USA, UK, Canada, Australia.
- Specialities: Custom headless/Liquid Shopify storefront development, Technical SEO audits, high-scale paid acquisition (Google Ads, Meta Ads), CRO (Conversion Rate Optimization).
- Stats & Milestones: Managed over AED 350K+ in ad spend, generated AED 1.2M+ in tracked revenue, 98% client satisfaction rate, 125+ successful Shopify and marketing integrations.
- Key Client Successes: Vivobarefoot ME, Alphalete Athletics, Aetrex, Farada, Sole Therapy, Floor Carpet AE.
- Services Offered: Custom Shopify Storefront Builds (AED 12k+), Full-funnel Growth Engine & PPC Scale (AED 8.5k/mo), Deep Technical SEO & Performance Optimization (AED 4k).
- Contact Info: email 'RIZWANSAEED610@gmail.com', phone '+971 50 000 0000'.
- Call to Action: Advise the user to use the 'Book a Call' calendar modal, use the Main Inquiry Form, or directly connect via WhatsApp.
Keep all answers punchy, elegant, professional, and business-focused. Avoid fluff. Format responses with clean bold highlights and lists if appropriate.`;
    } else if (section === "audit") {
      systemInstruction = `You are the "RS Deep Core AI Auditor", a top-tier Shopify performance specialist and senior SEO/CRO engineer.
Your task is to analyze the user's URL and Industry provided in their request, and generate a highly detailed, professional, and realistic speed, SEO, and CRO audit report.
Format your response as a single, valid JSON object with the following structure (do NOT wrap in markdown block, just return raw JSON):
{
  "seoScore": 88, // integer from 50 to 99
  "croScore": 82, // integer from 50 to 99
  "speedScore": 79, // integer from 50 to 99
  "accessibilityScore": 85, // integer from 50 to 99
  "generalComments": "Detailed high-level assessment of the website performance, identifying key structural blockades and brand opportunities...",
  "actionPoints": [
    "Identify and fix Shopify render-blocking Liquid assets inside theme.liquid (Estimated lift: +14% speed)",
    "Set up dynamic server-side Facebook CAPI and Google tag tracking to avoid browser attribution decay",
    "Revamp the primary checkout checkout-liquid or cart drawer layout to address a 3.4% micro-conversion leakage"
  ],
  "estimatedRevenueLift": "+24% Lift in conversion value (~AED 18,500/mo potential)"
}
Ensure the action points are incredibly specific, tailored to the industry specified, and contain exact, high-ticket engineering terms.`;
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.85,
      },
    });

    const generatedText = response.text || "No response received from the AI model.";
    return NextResponse.json({ text: generatedText });
  } catch (error: any) {
    console.error("Gemini API server-side route error:", error);
    return NextResponse.json({ 
      error: error?.message || "Internal Server Error during content generation." 
    }, { status: 500 });
  }
}
