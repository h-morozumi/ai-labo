<template>
    Avatar Screen
    <button @click="speak">Speak</button>
    <div>
        <video id="videoElm"></video>
        <audio id="audioElm"></audio>
    </div>
</template>
<script setup lang="ts">
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { useRuntimeConfig } from "#imports";

const config = useRuntimeConfig();
const speechKey: string = config.public.speechApiKey;
const speechRegion: string = config.public.speechRegion;

// テキスト読み上げ言語と音声変換を選択する
const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
// Set either the `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`.
speechConfig.speechSynthesisLanguage = "en-US"; //ja-JP
speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; //ja-JP-NanamiNeural

// アバターのキャラクターとスタイルを選択する
//(リアルタイム API では casual-sitting スタイルのみサポートされています)
const avatarConfig: SpeechSDK.AvatarConfig = new SpeechSDK.AvatarConfig(
    "lisa", // Set avatar character here.
    "casual-sitting", // Set avatar style here.
    new SpeechSDK.AvatarVideoFormat()
);

// リアルタイム アバターへの接続を設定する
// Create WebRTC peer connection
const iceServerURL: string = config.public.iceServerUrl;
const username: string = config.public.iceServerUsername;
const credential: string = config.public.iceServerCredential;

console.log(`iceServerURL: ${iceServerURL}, username: ${username}, credential: ${credential}`);

const peerConnection = new RTCPeerConnection({
    iceServers: [{
        urls: [iceServerURL],
        username: username,
        credential: credential
    }]
})
console.log("Created peer connection object");
console.log(peerConnection);

// Fetch WebRTC video/audio streams and mount them to HTML video/audio player elements
peerConnection.ontrack = async (event: RTCTrackEvent) => {
    if (event.track.kind === 'video') {
        console.log("Got video track");
        const videoElement: HTMLVideoElement = document.getElementById('videoElm') as HTMLVideoElement;
        videoElement.srcObject = event.streams[0];
        videoElement.autoplay = true;
    }

    if (event.track.kind === 'audio') {
        console.log("Got audio track");
        const audioElement: HTMLAudioElement = document.getElementById('audioElm') as HTMLAudioElement;
        audioElement.srcObject = event.streams[0];
        audioElement.autoplay = true;
    }
}

// Offer to receive one video track, and one audio track
peerConnection.addTransceiver('video', { direction: 'sendrecv' });
peerConnection.addTransceiver('audio', { direction: 'sendrecv' });

// Create avatar synthesizer
var avatarSynthesizer: SpeechSDK.AvatarSynthesizer = new SpeechSDK.AvatarSynthesizer(speechConfig, avatarConfig);

// Start avatar and establish WebRTC connection
avatarSynthesizer.startAvatarAsync(peerConnection).then(
    (r) => { console.log("Avatar started.") }
).catch(
    (error:any) => { console.log("Avatar failed to start. Error: " + error) }
);

const speak = async () => {
    console.log("speak");
    var spokenText = "I'm excited to try text to speech avatar."
    avatarSynthesizer.speakTextAsync(spokenText).then(
        (result) => {
            if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                console.log("Speech and avatar synthesized to video stream.")
            } else {
                console.log("Unable to speak. Result ID: " + result.resultId)
                if (result.reason === SpeechSDK.ResultReason.Canceled) {
                    let cancellationDetails = SpeechSDK.CancellationDetails.fromResult(result as SpeechSDK.SpeechSynthesisResult)
                    console.log(cancellationDetails.reason)
                    if (cancellationDetails.reason === SpeechSDK.CancellationReason.Error) {
                        console.log(cancellationDetails.errorDetails)
                    }
                }
            }
    }).catch((error) => {
        console.log(error)
        avatarSynthesizer.close()
    });
}
</script>

<style scoped>
video {
    width: 100%;
    /* 動画をレスポンシブ化 */
    /* max-width: 400px; 動画の最大幅 */
}
</style>
