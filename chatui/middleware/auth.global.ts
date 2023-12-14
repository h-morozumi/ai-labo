import { useMSAuth } from "~/composables/useMSAuth";
import { useAppUser } from "#imports";

// Nuxt.js ミドルウェアを定義します。
// このミドルウェアは、ユーザーが認証されていない場合にログインページにリダイレクトします。
export default defineNuxtRouteMiddleware(async (to, from) => {
  // サーバーサイドでは何もしない
  if (process.server) return;

  // Microsoft 認証コンポーザブルを使用
  const msAuth = useMSAuth();
  // アカウント情報を取得
  const accounts = msAuth.getAccounts();
  // アプリユーザーストアを使用
  const userStore = useAppUser();
  // トークンの取得を試みる（サイレント認証）
  const accessToken = await msAuth.acquireTokenSilent();
  // 認証されているかどうかを確認
  const isAuthenticated = msAuth.isAuthenticated() && !!accessToken;

  // ユーザー情報をストアとローカルストレージに保存
  if (isAuthenticated) {
    const user = {
      ...accounts[0],
      bearerToken: accessToken,
    };
    localStorage.setItem("user", JSON.stringify(user));
    userStore.value.user = user;
  }

  // ログインページで認証されていなければ何もしない
  if (to.name === "login" && !isAuthenticated) return;

  // 認証されていない場合はログインページにリダイレクト
  if (!isAuthenticated) {
    return navigateTo("/login", { replace: true });
  }

  // ログインページにいるが認証済みの場合はホームにリダイレクト
  if (to.name === "login") {
    return navigateTo("/", { replace: true });
  }

  // それ以外の場合は何もしない

});
