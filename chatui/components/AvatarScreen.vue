<template>
    <h2>Avatar Screen</h2>
    <div>
        <textarea rows="10" cols="40" v-model="spokenText"></textarea>
        <button @click="speak">Speak</button>
    </div>
    <div>
        <video id="videoElm"></video>
        <audio id="audioElm"></audio>
    </div>
</template>
<script setup lang="ts">
import { useAvatar } from "~/composables/useAvatar";
const avatar = useAvatar();
const spokenText = ref("");

// Avatarの初期化
avatar.setupSpeechConfig("ja-JP", "ja-JP-NanamiNeural");
avatar.setupAvatarConfig("lisa", "casual-sitting");
avatar.startSession("videoElm", "audioElm");

// テキストを読み上げる
const speak = async () => {
    console.log(`speak: ${spokenText.value}`);
    avatar.speak(spokenText.value);
    spokenText.value = "";
}
</script>

<style scoped>
video {
    width: 100%;
    /* 動画をレスポンシブ化 */
    /* max-width: 400px; 動画の最大幅 */
}
</style>
