<template>
    <form @submit.prevent="askQuestion">
        <ul>
            <li v-for="message in messages">
                {{ message.role }}: {{ message.content }}
            </li>
            <li v-if="answer">{{ answer.role }}: {{ answer.content }}</li>
        </ul>
        <div>
            <label>
                Question:
                <input v-model="question" type="text" />
            </label>
            <button type="submit">Ask</button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { useMSAuth } from "~/composables/useMSAuth";

interface Message {
    role: "user" | "assistant" | "bot" | "system" | "notification";
    content: string;
}

const msAuth = useMSAuth();
const messages = ref<Message[]>([]);
const answer = ref<Message | undefined>(undefined);
const question = ref("");

// チャット
const askQuestion = async () => {
    if (!question.value) return;

    const msg: Message = {
        role: "user",
        content: question.value,
    };
    messages.value.push(msg);
    question.value = "";

    // Token は毎回新たに取得新たに取得する
    const token = await msAuth.acquireTokenSilent();
    console.log(`json: ${JSON.stringify(messages)}`);

    const { data, error } = await useFetch("/api/openai", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: {
            messages: messages,
        },
        responseType: "stream",
    });
    if (error.value) {
        throw error.value;
    }
    const stream = data.value as ReadableStream;
    // should use await-for-of if not for https://bugs.chromium.org/p/chromium/issues/detail?id=929585
    const reader = stream.getReader();

    const ans: Message = {
        role: "assistant",
        content: "",
    };
    answer.value = ans;

    let done = false;
    while (!done) {
        const chunk = await reader.read();
        done = chunk.done;
        console.log(`chunk: ${done}`);
        if (done) break;// 最後のチャンクが2回読み込まれるので、ここで終了
        const value = chunk.value as Uint8Array;
        const data = new TextDecoder().decode(value);
        console.log(`content: ${data}`);
        answer.value.content += data;
    }
    messages.value.push(answer.value);
    answer.value = undefined;
};
</script>