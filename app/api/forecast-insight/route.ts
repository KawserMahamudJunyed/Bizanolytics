import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ 
      insight: "Error: GROQ_API_KEY is not set in your .env.local file. Please add your key to enable real-time AI insights." 
    }, { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ insight: "Invalid JSON body" }, { status: 400 });
  }

  const rawData = body?.rawData || [];
  const language = body?.language || 'en';
  
  if (rawData.length === 0) {
    return NextResponse.json({ insight: language === 'bn' ? "বিশ্লেষণ করার জন্য কোন ডেটা আপলোড করা হয়নি।" : "No data uploaded to analyze." }, { status: 400 });
  }

  // Summarize the data for the LLM
  const totalRevenue = rawData.reduce((acc: number, row: any) => acc + (row.Revenue_BDT || 0), 0);
  const totalUnits = rawData.reduce((acc: number, row: any) => acc + (row.Units_Sold || 0), 0);
  
  const summary = `
    Recent Sales Data Summary:
    - Total Revenue (BDT): ${totalRevenue}
    - Total Units Sold: ${totalUnits}
    - Total Records Analyzed: ${rawData.length}
    - Sample Data (first 3 rows): ${JSON.stringify(rawData.slice(0, 3))}
  `;

  const systemPrompt = language === 'bn' 
    ? "You are an expert commerce intelligence assistant for SMEs in Bangladesh. Provide an ultra-concise, high-impact forecasting insight based on the data. MAX 15-20 words. No fluff. YOU MUST WRITE YOUR ENTIRE RESPONSE IN BENGALI (BANGLA)."
    : "You are an expert commerce intelligence assistant for SMEs in Bangladesh. Provide an ultra-concise, high-impact forecasting insight based on the data. MAX 15-20 words. No fluff.";

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Analyze the following actual uploaded sales data summary and provide insights focusing on stockout risks, general trends, or pricing recommendations:\n\nData Summary:\n${summary}`
        }
      ],
      model: "llama-3.1-8b-instant",
    });

    const insight = chatCompletion.choices[0]?.message?.content || "No insight generated.";
    
    return NextResponse.json({ insight });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ 
      insight: "Error generating insight. Please ensure your Groq API key is valid and has sufficient quota." 
    }, { status: 500 });
  }
}
