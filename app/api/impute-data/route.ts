import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ 
      error: "GROQ_API_KEY is not set. Cannot run AI imputation." 
    }, { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { targetColumn, products } = body;
  
  if (!targetColumn || !products || !Array.isArray(products) || products.length === 0) {
    return NextResponse.json({ error: "Missing required fields (targetColumn, products array)." }, { status: 400 });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a data processing assistant. The user will provide a list of product names. You must categorize each product into a general commercial category (e.g., Electronics, Clothing, Groceries, Home Goods, etc.). 
          
          You MUST output ONLY a valid JSON object with a single key "categories" that contains an array of objects. 
          Each object in the array must have exactly two keys: "productName" and "category".`
        },
        {
          role: "user",
          content: `Products: ${JSON.stringify(products)}`
        }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
    });

    const rawResponse = chatCompletion.choices[0]?.message?.content || "{}";
    
    // Parse the AI response
    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch (e) {
      console.error("Failed to parse JSON", rawResponse);
      return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 });
    }
    
    return NextResponse.json({ mapping: parsed.categories || [] });
  } catch (error) {
    console.error("AI Imputation Error:", error);
    return NextResponse.json({ 
      error: "Error generating imputation. The AI service may be temporarily unavailable." 
    }, { status: 500 });
  }
}
