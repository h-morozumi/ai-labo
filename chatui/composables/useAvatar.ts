import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

export const useAvatar = () => {
  console.log("useAvatar.ts is running");

  // WebRTCが動作しているかどうかを確認する
  const isAvatarRunning = ref(false);

  // ランタイムコンフィグを取得
  const config = useRuntimeConfig();
  const {
    speechApiKey,
    speechRegion,
    iceServerUrl,
    iceServerUsername,
    iceServerCredential,
  } = config.public;

  // Speech SDKの設定
  let speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    speechApiKey,
    speechRegion
  );
  speechConfig.speechSynthesisLanguage = "en-US"; // デフォルト言語を設定
  speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; // デフォルト音声を設定

  // アバターの設定
  let avatarConfig = setupAvatarConfig("lisa", "casual-sitting");

  let peerConnection: RTCPeerConnection;
  let avatarSynthesizer: SpeechSDK.AvatarSynthesizer;

  // Speech SDK設定の更新
  function setupSpeechConfig(
    language: string,
    voiceName: string
  ): SpeechSDK.SpeechConfig {
    speechConfig.speechSynthesisLanguage = language; //ja-JP
    speechConfig.speechSynthesisVoiceName = voiceName; //ja-JP-NanamiNeural
    return speechConfig;
  }

  // アバター設定の更新
  function setupAvatarConfig(
    character: string,
    style: string
  ): SpeechSDK.AvatarConfig {
    return new SpeechSDK.AvatarConfig(
      character,
      style,
      new SpeechSDK.AvatarVideoFormat()
    );
  }

  // セッションの開始
  function startSession(videoElementId: string, audioElementId: string) {
    peerConnection = setupPeerConnection(
      iceServerUrl,
      iceServerUsername,
      iceServerCredential
    );
    setupMediaTracks(peerConnection, videoElementId, audioElementId);
    startAvatarSynthesis(peerConnection);
  }

  // WebRTC接続の設定
  function setupPeerConnection(
    url: string,
    username: string,
    credential: string
  ): RTCPeerConnection {
    const connection = new RTCPeerConnection({
      iceServers: [{ urls: [url], username, credential }],
    });
    console.log("Created peer connection object");
    return connection;
  }

  // メディアトラックの設定
  function setupMediaTracks(
    connection: RTCPeerConnection,
    videoId: string,
    audioId: string
  ) {
    connection.ontrack = (event: RTCTrackEvent) =>
      handleMediaTrack(event, videoId, audioId);
    connection.addTransceiver("video", { direction: "sendrecv" });
    connection.addTransceiver("audio", { direction: "sendrecv" });
  }

  // メディアトラックのハンドリング
  function handleMediaTrack(
    event: RTCTrackEvent,
    videoId: string,
    audioId: string
  ) {
    if (event.track.kind === "video") {
      const videoElement = document.getElementById(videoId) as HTMLVideoElement;
      videoElement.srcObject = event.streams[0];
      videoElement.autoplay = true;
    }
    if (event.track.kind === "audio") {
      const audioElement = document.getElementById(audioId) as HTMLAudioElement;
      audioElement.srcObject = event.streams[0];
      audioElement.autoplay = true;
    }
  }

  // アバターの合成開始
  function startAvatarSynthesis(connection: RTCPeerConnection) {
    avatarSynthesizer = new SpeechSDK.AvatarSynthesizer(
      speechConfig,
      avatarConfig
    );
    avatarSynthesizer
      .startAvatarAsync(connection)
      .then(() => {
        console.log("Avatar started.");
      })
      .catch((error: any) => {
        console.log("Avatar failed to start. Error: " + error);
      });
  }

  // テキストの読み上げ
  function speak(text: string) {
    avatarSynthesizer
      .speakTextAsync(text)
      .then(handleSpeakSuccess)
      .catch(handleSpeakError);
  }

  // 読み上げ成功時の処理
  function handleSpeakSuccess(result: SpeechSDK.SynthesisResult) {
    if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
      console.log("Speech and avatar synthesized to video stream.");
    } else {
      console.log("Unable to speak. Result ID: " + result.resultId);
      handleCancellation(result as SpeechSDK.SpeechSynthesisResult);
    }
  }

  // 読み上げ失敗時の処理
  function handleSpeakError(error: any) {
    console.log(error);
    avatarSynthesizer.close();
  }

  // 読み上げキャンセル時の処理
  function handleCancellation(result: SpeechSDK.SpeechSynthesisResult) {
    let cancellationDetails = SpeechSDK.CancellationDetails.fromResult(result);
    console.log(cancellationDetails.reason);
    if (cancellationDetails.reason === SpeechSDK.CancellationReason.Error) {
      console.log(cancellationDetails.errorDetails);
    }
  }

  // 読み上げの停止
  function stopSpeaking() {
    avatarSynthesizer
      .stopSpeakingAsync()
      .then(() => {
        console.log("Stop speaking request sent.");
      })
      .catch(() => {
        console.log("Stop speaking request failed.");
      });
  }

  // セッションの停止
  function stopSession() {
    avatarSynthesizer.close();
  }

  return {
    // avatarSynthesizer,
    // peerConnection,
    isAvatarRunning,
    speechConfig,
    avatarConfig,
    setupSpeechConfig,
    setupAvatarConfig,
    startSession,
    speak,
    stopSpeaking,
    stopSession,
  };
};
