import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" })

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ 
      reply: "Please add your GROQ_API_KEY to .env.local to enable the intelligence engine." 
    }, { status: 500 })
  }

  try {
    const body = await req.json()
    const { message, history, rawData } = body

    let context = ""
    if (rawData && rawData.length > 0) {
      const totalRevenue = rawData.reduce((acc: number, row: any) => acc + (row.Revenue_BDT || 0), 0)
      const totalUnits = rawData.reduce((acc: number, row: any) => acc + (row.Units_Sold || 0), 0)
      const topProducts = rawData.slice(0, 5) // Just a sample
      context = `
        The user has uploaded sales data. Here is a summary:
        - Total Revenue (BDT): ${totalRevenue}
        - Total Units Sold: ${totalUnits}
        - Total Records: ${rawData.length}
        - Sample Data: ${JSON.stringify(topProducts)}
      `
    } else {
      context = "The user has not uploaded any data yet. Tell them to upload data to get insights."
    }

    const systemPrompt = `You are Bizanolytics Intelligence, a hyper-intelligent, professional data analyst assistant for SMEs in Bangladesh. 
    Use the following context about the user's uploaded data to answer their question. Keep answers concise, actionable, and formatted nicely.
    
    Context:
    ${context}
    `
    
    // Construct conversation history for Groq
    const messages: any[] = []
    messages.push({ role: "system", content: systemPrompt })
    
    for (const msg of history) {
      messages.push({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      })
    }
    messages.push({ role: "user", content: message })

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant",
    })

    const reply = chatCompletion.choices[0]?.message?.content || "No reply generated."
    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json({ 
      reply: "I'm sorry, I encountered an error analyzing your request. Please try again." 
    }, { status: 500 })
  }
}
