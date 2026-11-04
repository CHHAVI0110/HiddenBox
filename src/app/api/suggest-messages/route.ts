import ollama from "ollama";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const prompt =
            `Create a list of three open-ended and engaging questions 
            formatted as a single string.

            Each question should be separated by '||'.

            These questions are for an anonymous social messaging 
            platform, like Qooh.me, and should be suitable for a 
            diverse audience.

            Avoid personal or sensitive topics, focusing instead on 
            universal themes that encourage friendly interaction.

            Example output:
            What's a hobby you've recently started?||
            If you could have dinner with any historical figure, 
            who would it be?||
            What's a simple thing that makes you happy?

            Ensure the questions are intriguing, foster curiosity, 
            and contribute to a positive and welcoming conversational 
            environment.

            Return only the three questions. Do not include numbering 
            or additional explanations.`;

        const response = await ollama.generate({
            model: "llama3.2:3b",
            prompt,
            stream: true,
        });

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        const text = chunk.response;

                        if (text) {
                            controller.enqueue(
                                new TextEncoder().encode(text)
                            );
                        }
                    }

                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });

    } catch (error) {
        console.error("Ollama error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to generate suggested messages",
            },
            { status: 500 }
        );
    }
}