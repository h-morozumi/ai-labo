import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

export const useAvatar = () => {
  console.log("useAvatar.ts is running");

  // WebRTCが動作しているかどうかを確認する
  const isAvatarRunning = useState("isAvatarRunning", () => false);

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
  const speechConfig = useState("speechConfig", () => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      speechApiKey,
      speechRegion
    );
    speechConfig.speechSynthesisLanguage = "en-US"; //ja-JP
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; //ja-JP-NanamiNeural
    return speechConfig;
  });

  // アバターの設定
  let avatarConfig = useState(
    "avatarConfig",
    () =>
      new SpeechSDK.AvatarConfig(
        "lisa",
        "casual-sitting",
        new SpeechSDK.AvatarVideoFormat()
      )
  );

  let peerConnection: RTCPeerConnection | undefined;
  let avatarSynthesizer: SpeechSDK.AvatarSynthesizer | undefined;
  let speechRecognizer: Ref<SpeechSDK.SpeechRecognizer> | undefined; // マイク入力をする際に使用する

  // Speech SDK設定の更新
  function setupSpeechConfig(
    language: string,
    voiceName: string
  ): SpeechSDK.SpeechConfig {
    speechConfig.value.speechSynthesisLanguage = language; //ja-JP
    speechConfig.value.speechSynthesisVoiceName = voiceName; //ja-JP-NanamiNeural
    return speechConfig.value;
  }

  // アバター設定の更新
  function setupAvatarConfig(
    character: string,
    style: string
  ): SpeechSDK.AvatarConfig {
    avatarConfig.value.character = character;
    avatarConfig.value.style = style;
    return avatarConfig.value;
  }

  // セッションの開始
  function startSession(videoElementId: string, audioElementId: string) {
    isAvatarRunning.value = false;
    speechRecognizer = useState(
      "speechRecognizer",
      () =>
        new SpeechSDK.SpeechRecognizer(
          speechConfig.value,
          SpeechSDK.AudioConfig.fromDefaultMicrophoneInput()
        )
    );

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
      watchConnectionChange(connection);
    connection.addTransceiver("video", { direction: "sendrecv" });
    connection.addTransceiver("audio", { direction: "sendrecv" });
  }

  function watchConnectionChange(connection: RTCPeerConnection) {
    connection.onconnectionstatechange = (event) => {
      switch (connection.connectionState) {
        case "connected":
          console.log("Peer connection is connected.");
          isAvatarRunning.value = true;
          break;
        case "disconnected":
        case "failed":
          console.log("Peer connection is disconnected.");
          isAvatarRunning.value = false;
          break;
        case "closed":
          console.log("Peer connection is closed.");
          isAvatarRunning.value = false;
          break;
      }
    };
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
      speechConfig.value,
      avatarConfig.value
    );
    avatarSynthesizer
      .startAvatarAsync(connection)
      .then(() => {
        console.log("Avatar started.");
        isAvatarRunning.value = true;
      })
      .catch((error: any) => {
        console.log("Avatar failed to start. Error: " + error);
        isAvatarRunning.value = false;
      });
    avatarSynthesizer.avatarEventReceived = function (s, e) {
      let offsetMessage =
        ", offset from session start: " + e.offset / 10000 + "ms.";
      if (e.offset === 0) {
        offsetMessage = "";
      }
      console.log("Event received: " + e.description + offsetMessage);
    };
  }

  // テキストの読み上げ
  function speak(text: string) {
    if (!avatarSynthesizer) return;
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
    avatarSynthesizer?.close();
    isAvatarRunning.value = false;
  }

  // 読み上げキャンセル時の処理
  function handleCancellation(result: SpeechSDK.SpeechSynthesisResult) {
    let cancellationDetails = SpeechSDK.CancellationDetails.fromResult(result);
    console.log(cancellationDetails.reason);
    if (cancellationDetails.reason === SpeechSDK.CancellationReason.Error) {
      console.log(cancellationDetails.errorDetails);
      isAvatarRunning.value = false;
    }
  }

  // 読み上げの停止
  function stopSpeaking() {
    if (!avatarSynthesizer) return;
    avatarSynthesizer
      .stopSpeakingAsync()
      .then(() => {
        console.log("Stop speaking request sent.");
      })
      .catch(() => {
        console.log("Stop speaking request failed.");
        isAvatarRunning.value = false;
      });
  }

  // セッションの停止
  function stopSession() {
    speechRecognizer?.stopContinuousRecognitionAsync();
    speechRecognizer?.close();
    avatarSynthesizer?.close();
    isAvatarRunning.value = false;
  }

  return {
    // avatarSynthesizer,
    // peerConnection,
    speechRecognizer,
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
