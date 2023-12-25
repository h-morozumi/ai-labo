import { defineEventHandler, readBody, sendStream } from "h3";
import { Stream } from "stream";
import OpenAI from "openai";

const config = useRuntimeConfig();

const openai = new OpenAI({
  apiKey: config.openAi.apiKey,
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const messages = body.messages;
  console.log("messages", messages)
  if(!messages) {
    throw new Error("No messages");
  }

  const stream = await openai.chat.completions.create({
    model: "gpt-4", // or `gpt-3.5-turbo`
    messages: messages,
    stream: true,
  });

  //Debugging
  // for await (const chunk of stream) {
  //   console.log(chunk);
  //   console.log(chunk.choices[0]?.delta?.content || '');
  // }

  const chatCompletionAsyncIterator =
    async function* (): AsyncIterable<string> {
      for await (const chunk of stream) {
        console.log(JSON.stringify(chunk, null, 2)); //Debugging
        yield chunk.choices
          .map((v) => v.delta.content)
          .filter((v) => !!v)
          .join();
      }
    };
  const readable = Stream.Readable.from(chatCompletionAsyncIterator());
  event.node.res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
  event.node.res.setHeader("Cache-Control", "no-cache, no-transform");
  return sendStream(event, readable);
});
