import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

export const useAvatar = () => {
  // ランタイムコンフィグを取得
  const config = useRuntimeConfig();
  const speechKey: string = config.public.speechApiKey;
  const speechRegion: string = config.public.speechRegion;

  // テキスト読み上げ言語と音声変換を選択する
  let speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    speechKey,
    speechRegion
  );
  // set default language
  speechConfig.speechSynthesisLanguage = "en-US";
  speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

  // アバターのキャラクターとスタイルを選択する
  //(リアルタイム API では casual-sitting スタイルのみサポートされています)
  let avatarConfig: SpeechSDK.AvatarConfig = new SpeechSDK.AvatarConfig(
    "lisa", // Set avatar character here.
    "casual-sitting", // Set avatar style here.
    new SpeechSDK.AvatarVideoFormat()
  );

  // リアルタイム アバターへの接続を設定する
  // Create WebRTC peer connection
  const iceServerURL: string = config.public.iceServerUrl;
  const username: string = config.public.iceServerUsername;
  const credential: string = config.public.iceServerCredential;

  let peerConnection: RTCPeerConnection;
  let avatarSynthesizer: SpeechSDK.AvatarSynthesizer;

  function setupSpeechConfig(
    speechSynthesisLanguage: string,
    speechSynthesisVoiceName: string
  ): SpeechSDK.SpeechConfig {
    // Set either the `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`.
    speechConfig.speechSynthesisLanguage = speechSynthesisLanguage; //ja-JP
    speechConfig.speechSynthesisVoiceName = speechSynthesisVoiceName; //ja-JP-NanamiNeural
    return speechConfig;
  }

  function setupAvatarConfig(
    avatarCharacter: string,
    avatarStyle: string
  ): SpeechSDK.AvatarConfig {
    avatarConfig = new SpeechSDK.AvatarConfig(
      avatarCharacter, // Set avatar character here.
      avatarStyle, // Set avatar style here.
      new SpeechSDK.AvatarVideoFormat()
    );
    return avatarConfig;
  }

  function startSession(videoElementId: string, audioElementId: string) {
    peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [iceServerURL],
          username: username,
          credential: credential,
        },
      ],
    });

    console.log("Created peer connection object");
    console.log(peerConnection);
    // Fetch WebRTC video/audio streams and mount them to HTML video/audio player elements
    peerConnection.ontrack = async (event: RTCTrackEvent) => {
      if (event.track.kind === "video") {
        console.log("Got video track");
        const videoElement: HTMLVideoElement = document.getElementById(
          videoElementId
        ) as HTMLVideoElement;
        videoElement.srcObject = event.streams[0];
        videoElement.autoplay = true;
      }

      if (event.track.kind === "audio") {
        console.log("Got audio track");
        const audioElement: HTMLAudioElement = document.getElementById(
          audioElementId
        ) as HTMLAudioElement;
        audioElement.srcObject = event.streams[0];
        audioElement.autoplay = true;
      }
    };

    // Offer to receive one video track, and one audio track
    peerConnection.addTransceiver("video", { direction: "sendrecv" });
    peerConnection.addTransceiver("audio", { direction: "sendrecv" });

    // Create avatar synthesizer
    avatarSynthesizer = new SpeechSDK.AvatarSynthesizer(
      speechConfig,
      avatarConfig
    );

    // Start avatar and establish WebRTC connection
    avatarSynthesizer
      .startAvatarAsync(peerConnection)
      .then((r) => {
        console.log("Avatar started.");
      })
      .catch((error: any) => {
        console.log("Avatar failed to start. Error: " + error);
      });
  }

  function speak(spokenText: string) {
    avatarSynthesizer
      .speakTextAsync(spokenText)
      .then((result) => {
        if (
          result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted
        ) {
          console.log("Speech and avatar synthesized to video stream.");
        } else {
          console.log("Unable to speak. Result ID: " + result.resultId);
          if (result.reason === SpeechSDK.ResultReason.Canceled) {
            let cancellationDetails = SpeechSDK.CancellationDetails.fromResult(
              result as SpeechSDK.SpeechSynthesisResult
            );
            console.log(cancellationDetails.reason);
            if (
              cancellationDetails.reason === SpeechSDK.CancellationReason.Error
            ) {
              console.log(cancellationDetails.errorDetails);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
        avatarSynthesizer.close();
      });
  }

  function stopSpeaking() {
    avatarSynthesizer
      .stopSpeakingAsync()
      .then(() => console.log("Stop speaking request sent."))
      .catch(() => {
        console.log("Stop speaking request failed.");
      });
  }

  function stopSession() {
    avatarSynthesizer.close();
    // peerConnection.close();
  }

  return {
    // avatarSynthesizer,
    // peerConnection,
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
