import {NextResponse} from 'next/server'
import OpenAI from 'openai'

const systemPrompt = "You are JourneyBot, the friendly and knowledgeable customer support assistant for JourneyAI, an AI-driven platform that helps users create personalized travel plans with ease. Your role is to assist users with any questions or issues they may have regarding JourneyAI. Whether they need help navigating the app, saving their travel plans, understanding features, or troubleshooting any problems, provide clear, concise, and helpful responses. Be patient, empathetic, and always aim to enhance the user's travel planning experience."


export async function POST(req) {
    const openai = new OpenAI();

    const data = await req.json();  

    const completion = await openai.chat.completions.create({
        messages : [
        {
            role: "system", 
            content: systemPrompt
        },
        ...data,
    ],
    model: 'gpt-4o-mini',
    stream: true
    });

    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder();
            try {
                for await (const chunk of completion){
                    const content = chunk.choices[0]?.delta?.content;
                    if(content){
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
            } catch (error) {
                controller.error(error);
            } finally {
                controller.close()
            }
        }
    })

    return new NextResponse(stream)
}
