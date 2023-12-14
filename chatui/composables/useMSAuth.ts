import {
  BrowserCacheLocation,
  EventType,
  PublicClientApplication,
} from "@azure/msal-browser";
import type {
  AuthenticationResult,
  AccountInfo,
  SilentRequest,
} from "@azure/msal-browser";

// トークンの有効期限が切れる前にリフレッシュするためのタイマーを保持する変数
let tokenExpirationTimer: ReturnType<typeof setTimeout> | undefined;

export const useMSAuth = () => {
  // ランタイムコンフィグを取得
  const config = useRuntimeConfig();

  // MSALの設定
  const msalConfig = {
    auth: {
      clientId: config.public.clientId,
      authority: config.public.authority,
      redirectUri: config.public.redirectUri,
      postLogoutRedirectUri: config.public.postLogoutRedirectUri,
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: true, // クロスサイトの問題を避けるためにCookieに状態を保存
    },
    system: {
      tokenRenewalOffsetSeconds: 300, // 有効期限の5分前に更新
    },
  };

  // MSALインスタンスのステートを初期化
  const msalInstance = useState(
    "msalInstance",
    () => new PublicClientApplication(msalConfig)
  );

  // MSALインスタンスの初期化とイベントコールバックの設定
  async function initialize(): Promise<void> {
    try {
      // MSALの初期化
      await msalInstance.value.initialize();
      // リダイレクト結果の処理
      const response = await msalInstance.value.handleRedirectPromise();
      handleResponse(response);
      // ログイン成功イベントの監視
      msalInstance.value.addEventCallback((event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS) {
          setupTokenExpirationTimer();
        }
      });
    } catch (err) {
      console.error("Error during MSAL initialization:", err);
    }
  }

  // 認証結果のハンドリング
  function handleResponse(resp: AuthenticationResult | null): void {
    if (resp?.account) {
      setupTokenExpirationTimer();
    } else {
      console.log("No authentication response. User may need to sign in.");
    }
  }

  // トークンの有効期限タイマーを設定
  function setupTokenExpirationTimer(): void {
    const accounts = msalInstance.value.getAllAccounts();
    if (accounts.length > 0) {
      const account = accounts[0];
      const exp = account.idTokenClaims?.exp;
      if (typeof exp === "number") {
        // トークンの有効期限までの時間を計算
        const tokenExpirationTime = exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiration = tokenExpirationTime - currentTime;

        // 古いタイマーをクリアして新しいタイマーを設定
        if (tokenExpirationTimer) clearTimeout(tokenExpirationTimer);
        tokenExpirationTimer = setTimeout(() => {
          refreshAccessToken(account);
        }, timeUntilExpiration);
      }
    }
  }

  // アクセストークンをサイレントリフレッシュ
  async function refreshAccessToken(account: AccountInfo): Promise<void> {
    const silentRequest: SilentRequest = {
      account,
      scopes: ["User.Read"], // 必要なスコープを設定
    };

    try {
      // サイレントリフレッシュを試みる
      const response = await msalInstance.value.acquireTokenSilent(
        silentRequest
      );
      console.log("Refreshed Access Token:", response.accessToken);
      setupTokenExpirationTimer();
    } catch (err) {
      console.error("Error refreshing access token:", err);
    }
  }

  // ログインリクエストのスコープを設定
  const loginRequest = {
    scopes: ["User.Read"],
  };

  // ユーザーをサインインさせる
  async function signIn(): Promise<void> {
    try {
      await msalInstance.value.loginRedirect(loginRequest);
    } catch (err) {
      console.error("Error during sign-in:", err);
    }
  }

  // サイレントトークン取得
  async function acquireTokenSilent(): Promise<string | null> {
    const accounts = msalInstance.value.getAllAccounts();
    if (accounts.length > 0) {
      const account = accounts[0];
      msalInstance.value.setActiveAccount(account);
      try {
        const response = await msalInstance.value.acquireTokenSilent({
          account,
          scopes: ["User.Read"],
        });
        return response.accessToken;
      } catch (err) {
        console.error("Error acquiring token silently:", err);
        return null;
      }
    } else {
      console.error("No accounts found");
      return null;
    }
  }

  // アカウントの取得
  function getAccounts(): AccountInfo[] {
    return msalInstance.value.getAllAccounts();
  }

  // 認証されているかどうかをチェック
  function isAuthenticated(): boolean {
    return getAccounts().length > 0;
  }

  // ユーザーをサインアウトさせる
  function signOut(accountId: string): void {
    const account = msalInstance.value.getAccountByHomeId(accountId);
    if (account) {
      msalInstance.value.logoutRedirect({ account });
      localStorage.clear(); // 必要に応じてローカルストレージをクリア
    } else {
      console.error("Account not found");
    }
  }

  // 使用可能なメソッドとプロパティを返す
  return {
    initialize,
    msalInstance,
    signIn,
    getAccounts,
    acquireTokenSilent,
    isAuthenticated,
    signOut,
  };
};
