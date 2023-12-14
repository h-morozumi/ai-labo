import type { UserInfo } from "~/types/UserInfo";

/**
 * アプリケーション全体で使用されるユーザー情報を管理するフックです。
 * @returns {Ref<UserInfo>} ユーザー情報を保持するリアクティブな参照オブジェクト
 */
export const useAppUser = () => {
  // ユーザー情報の初期状態を定義
  const defaultUserInfo: UserInfo = {
    user: null,
    userImage: null,
  };

  // useStateを使用して、グローバルな状態としてユーザー情報を保持する
  // "user"は状態の一意なキーで、defaultUserInfoが初期値として使用される
  const userState = useState<UserInfo>('user', () => defaultUserInfo);

  // ユーザー情報を保持するリアクティブな参照オブジェクトを返す
  return userState;
};
