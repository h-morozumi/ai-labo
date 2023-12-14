// ~/types/user-info.ts
import type { AccountInfo } from "@azure/msal-browser";

/**
 * アプリケーションで使用されるユーザー情報の型を定義します。
 */
export interface UserInfo {
  // ユーザーの認証情報。認証されていない場合はnullです。
  user: AccountInfo | null;

  // ユーザーのプロフィール画像のURL。設定されていない場合はnullです。
  userImage: string | null;
}
