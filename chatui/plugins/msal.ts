// ~/plugins/ms-auth.ts
import { useMSAuth } from "~/composables/useMSAuth";

// Nuxtプラグインを定義して、MSAuthの初期化を行います。
export default defineNuxtPlugin(async (nuxtApp) => {
  // useMSAuthコンポーザブルを使用してMSAuthのインスタンスを取得します。
  const msAuth = useMSAuth();

  // MSAuthの初期化を試みます。
  try {
    // MSAuthの初期化メソッドを非同期で実行します。
    await msAuth.initialize();
  } catch (error) {
    // 初期化中にエラーが発生した場合はコンソールにエラーを出力します。
    console.error("MSAuth initialization failed:", error);
    // 必要に応じて追加のエラーハンドリングをここに記述できます。
    // 例えばエラーをNuxtアプリの状態に保存する、UIにエラーメッセージを表示する等。
  }

  // プラグインはオプションを返すことができますが、この場合は何も返す必要はありません。
  return {};
});
