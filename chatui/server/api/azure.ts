import { defineEventHandler, send } from "h3";

// ランタイムコンフィグを取得
const config = useRuntimeConfig();

// Microsoft Graph API の URL
const graphApiUrl = config.graphApiUrl as string;

// イベントハンドラーを定義します。
export default defineEventHandler(async (event) => {
  const authUser = event.context.user;
  console.log(`authUser: ${JSON.stringify(authUser)}`);

  // Authorization ヘッダーを取得します。
  const authorization = getHeader(event, "Authorization");

  // Authorization ヘッダーが存在しない、または Bearer トークンが含まれていない場合、エラーを返します。
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.error("Authorization header is missing or is not a Bearer token.");
    throw createError({ statusCode: 401, statusMessage: 'Authorization Error' });
  }

  // Bearer トークンを抽出します。
  const token = authorization.replace("Bearer ", "");

   try {
    // Fetch API を使用してユーザー情報を取得します。
    const user = await $fetch(graphApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 成功した場合、ユーザー情報をJSON形式で返します。
    await send(event, JSON.stringify(user), "application/json");
  } catch (error) {
    // エラーが発生した場合、エラーメッセージを返します。
    console.error("Data fetch failed:", error);
    throw createError({ statusCode: 401, statusMessage: 'Authorization Error' });
  }
});

