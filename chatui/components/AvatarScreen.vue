<template>
    <h2>Avatar Screen</h2>
    <div>
        <h2>Settings</h2>
        <div>
            <label for="language">Language</label>
            <select id="language" v-model="avatarlangege" :disabled="avatar.isAvatarRunning.value">
                <option value="ja-JP">日本語 (日本)</option>
                <option value="en-US">英語 (米国)</option>
                <option value="ko-KR">韓国語 (韓国)</option>
                <option value="zh-CN">中国語 (標準、簡体字)</option>
            </select>
            <label for="voice">Voice</label>
            <select v-if="avatarlangege === 'en-US'" id="voice" v-model="avatarvoice"
                :disabled="avatar.isAvatarRunning.value">
                <option value="en-US-JennyMultilingualNeural3">JennyMultilingualNeural3(女性)</option>
                <option value="en-US-JennyNeural">JennyNeural(女性)</option>
                <option value="en-US-GuyNeural">GuyNeural(男性)</option>
                <option value="en-US-AriaNeural">AriaNeural(女性)</option>
                <option value="en-US-DavisNeural">DavisNeural(男性)</option>
                <option value="en-US-AmberNeural">AmberNeural(女性)</option>
                <option value="en-US-AnaNeural">AnaNeural(女性、子供)</option>
                <option value="en-US-AndrewNeural">AndrewNeural(男性)</option>
                <option value="en-US-AshleyNeural">AshleyNeural(女性)</option>
                <option value="en-US-BrandonNeural">BrandonNeural(男性)</option>
                <option value="en-US-BrianNeural">BrianNeural(男性)</option>
                <option value="en-US-ChristopherNeural">ChristopherNeural(男性)</option>
                <option value="en-US-CoraNeural">CoraNeural(女性)</option>
                <option value="en-US-ElizabethNeural">ElizabethNeural(女性)</option>
                <option value="en-US-EmmaNeural">EmmaNeural(女性)</option>
                <option value="en-US-EricNeural">EricNeural(男性)</option>
                <option value="en-US-JacobNeural">JacobNeural(男性)</option>
                <option value="en-US-JaneNeural">JaneNeural(女性)</option>
                <option value="en-US-JasonNeural">JasonNeural(男性)</option>
                <option value="en-US-MichelleNeural">MichelleNeural(女性)</option>
                <option value="en-US-MonicaNeural">MonicaNeural(女性)</option>
                <option value="en-US-NancyNeural">NancyNeural(女性)</option>
                <option value="en-US-RogerNeural">RogerNeural(男性)</option>
                <option value="en-US-SaraNeural">SaraNeural(女性)</option>
                <option value="en-US-SteffanNeural">SteffanNeural(男性)</option>
                <option value="en-US-TonyNeural">TonyNeural(男性)</option>
                <option value="en-US-AIGenerate1Neural1">AIGenerate1Neural1(男性)</option>
                <option value="en-US-AIGenerate2Neural1">AIGenerate2Neural1(女性)</option>
                <option value="en-US-BlueNeural1">BlueNeural1(ニュートラル)</option>
                <option value="en-US-JennyMultilingualV2Neural">JennyMultilingualV2Neural(女性)</option>
                <option value="en-US-RyanMultilingualNeural">RyanMultilingualNeural(男性)</option>
            </select>
            <select v-if="avatarlangege === 'ja-JP'" v-model="avatarvoice" :disabled="avatar.isAvatarRunning.value">
                <option value="ja-JP-NanamiNeural">NanamiNeural(女性)</option>
                <option value="ja-JP-KeitaNeural">KeitaNeural(男性)</option>
                <option value="ja-JP-AoiNeural">AoiNeural(女性)</option>
                <option value="ja-JP-DaichiNeural">DaichiNeural(男性)</option>
                <option value="ja-JP-MayuNeural">MayuNeural(女性)</option>
                <option value="ja-JP-NaokiNeural">NaokiNeural(男性)</option>
                <option value="ja-JP-ShioriNeural">ShioriNeural(女性)</option>
            </select>
            <select v-if="avatarlangege === 'ko-KR'" v-model="avatarvoice" :disabled="avatar.isAvatarRunning.value">
                <option value="ko-KR-SunHiNeural">SunHiNeural(女性)</option>
                <option value="ko-KR-InJoonNeural">InJoonNeural(男性)</option>
                <option value="ko-KR-BongJinNeural">BongJinNeural(男性)</option>
                <option value="ko-KR-GookMinNeural">GookMinNeural(男性)</option>
                <option value="ko-KR-HyunsuNeural">HyunsuNeural(男性)</option>
                <option value="ko-KR-JiMinNeural">JiMinNeural(女性)</option>
                <option value="ko-KR-SeoHyeonNeural">SeoHyeonNeural(女性)</option>
                <option value="ko-KR-SoonBokNeural">SoonBokNeural(女性)</option>
                <option value="ko-KR-YuJinNeural">YuJinNeural(女性)</option>
            </select>
            <select v-if="avatarlangege === 'zh-CN'" v-model="avatarvoice" :disabled="avatar.isAvatarRunning.value">
                <option value="zh-CN-XiaoxiaoNeural">XiaoxiaoNeural(女性)</option>
                <option value="zh-CN-YunxiNeural">YunxiNeural(男性)</option>
                <option value="zh-CN-YunjianNeural">YunjianNeural(男性)</option>
                <option value="zh-CN-XiaoyiNeural">XiaoyiNeural(女性)</option>
                <option value="zh-CN-YunyangNeural">YunyangNeural(男性)</option>
                <option value="zh-CN-XiaochenNeural">XiaochenNeural(女性)</option>
                <option value="zh-CN-XiaohanNeural">XiaohanNeural(女性)</option>
                <option value="zh-CN-XiaomengNeural">XiaomengNeural(女性)</option>
                <option value="zh-CN-XiaomoNeural">XiaomoNeural(女性)</option>
                <option value="zh-CN-XiaoqiuNeural">XiaoqiuNeural(女性)</option>
                <option value="zh-CN-XiaoruiNeural">XiaoruiNeural(女性)</option>
                <option value="zh-CN-XiaoshuangNeural">XiaoshuangNeural(女性、子供)</option>
                <option value="zh-CN-XiaoxuanNeural">XiaoxuanNeural(女性)</option>
                <option value="zh-CN-XiaoyanNeural">XiaoyanNeural(女性)</option>
                <option value="zh-CN-XiaoyouNeural">XiaoyouNeural(女性、子供)</option>
                <option value="zh-CN-XiaozhenNeural">XiaozhenNeural(女性)</option>
                <option value="zh-CN-YunfengNeural">YunfengNeural(男性)</option>
                <option value="zh-CN-YunhaoNeural">YunhaoNeural(男性)</option>
                <option value="zh-CN-YunxiaNeural">YunxiaNeural(男性)</option>
                <option value="zh-CN-YunyeNeural">YunyeNeural(男性)</option>
                <option value="zh-CN-YunzeNeural">YunzeNeural(男性)</option>
                <option value="zh-CN-XiaorouNeural1">XiaorouNeural1(女性)</option>
                <option value="zh-CN-YunjieNeural1">YunjieNeural1(男性)</option>
            </select>
        </div>
        <hr />
        <div>
            <button @click="connectServer" :disabled="avatar.isAvatarRunning.value">Start Avatar</button>
            <button @click="closeServer" :disabled="!avatar.isAvatarRunning.value">Stop Avatar</button>
        </div>
        <div>
            <textarea rows="10" cols="40" v-model="spokenText"></textarea>
            <button @click="stop" :disabled="!avatar.isAvatarRunning.value">Stop</button>
            <button @click="speak" :disabled="!avatar.isAvatarRunning.value || spokenText === ''">Speak</button>
            {{ avatar.isAvatarRunning.value ? "Avatar is running" : "Avatar is not running" }}
        </div>
        <div>
            <button @click="startMicrophone" :disabled="!avatar.isAvatarRunning.value">Start Microphone</button>
        </div>
    </div>

    <div>
        <video id="videoElm"></video>
        <audio id="audioElm"></audio>
    </div>
</template>
<script setup lang="ts">
import { useAvatar } from "~/composables/useAvatar";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const avatar = useAvatar();
const spokenText = ref("");
const avatarlangege = ref("ja-JP");
const avatarvoice = ref("");
const block = ref(false);

// Avatarサーバーに接続する
const connectServer = async () => {
    console.log(`connectServer: ${avatarlangege.value}, ${avatarvoice.value}`);
    block.value = true;
    if (avatarlangege.value === "" || avatarvoice.value === "") {
        alert("言語と声を選択してください");
        return;
    }
    avatar.setupSpeechConfig(avatarlangege.value, avatarvoice.value);
    avatar.startSession("videoElm", "audioElm");
    block.value = false;
}

// Avatarサーバーを切断する
const closeServer = async () => {
    console.log("closeServer");
    avatar.stopSession();
}

// テキストを読み上げる
const speak = async () => {
    console.log(`speak: ${spokenText.value}`);
    avatar.speak(spokenText.value);
    spokenText.value = "";
}

const speak2 = async (text: string) => {
    console.log(`speak2: ${text}`);
    avatar.speak(text);
}

// 読み上げを停止する
const stop = async () => {
    console.log("stop");
    avatar.stopSpeaking();
}

const startMicrophone = async () => {
    console.log("startMicrophone");
    const audioElement = document.getElementById("audioElm") as HTMLAudioElement;
    audioElement.play();
    console.log("startMicrophone: audioElement.play()");
    const speechRecognizer = avatar.getSpeechRecognizer();
    console.log(`★speechRecognizer: ${speechRecognizer}`);

    if (speechRecognizer) {
        console.log("startMicrophone: speechRecognizer");
        speechRecognizer.recognized = async (sender: SpeechSDK.Recognizer, event: SpeechSDK.SpeechRecognitionEventArgs) => {
            console.log("startMicrophone: speechRecognizer.recognized");
            if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                console.log("startMicrophone: speechRecognizer.recognized: RecognizedSpeech");
                let userQuery = event.result.text.trim()
                console.log(`startMicrophone: speechRecognizer.recognized: RecognizedSpeech: ${userQuery}`);
                if (userQuery === '') {
                    console.log("startMicrophone: speechRecognizer.recognized: RecognizedSpeech: userQuery === ''");
                    return
                }
                speak2(userQuery);
            }
        }
        console.log("startMicrophone: speechRecognizer.startContinuousRecognitionAsync()");
        speechRecognizer?.startContinuousRecognitionAsync();
        console.log("startMicrophone: speechRecognizer.startContinuousRecognitionAsync() end");
    }
}
</script>

<style scoped>
video {
    width: 100%;
    /* 動画をレスポンシブ化 */
    /* max-width: 400px; 動画の最大幅 */
}
</style>
