import { defineEventHandler, createError } from "h3";

// Microsoft Graph API の URL
const graphApiUrl = "https://graph.microsoft.com/v1.0/me";

export default defineEventHandler(async (event) => {
  // クライアントサイドでは実行しないようにする（本当は next.config.ts で設定できるはずだがうまくいかない)
  if (!event.path.startsWith("/api")) return;

  // Authorization ヘッダーを取得します。
  const authorization = getHeader(event, "Authorization");

  // Authorization ヘッダーが存在しない、または Bearer トークンが含まれていない場合、エラーを返します。
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.error("Authorization header is missing or is not a Bearer token.");
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization Error",
    });
  }

  // Bearer トークンを抽出します。
  const token = authorization.replace("Bearer ", "");

  const userData = await verifyToken(token);
  if (!userData) {
    throw createError({ statusCode: 401, statusMessage: "Invalid Token" });
  }
  event.context.user = userData;
});

async function verifyToken(token: string) {
  try {
    // Fetch API を使用してユーザー情報を取得します。
    const user = await $fetch(graphApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return user;
  } catch (error) {
    // エラーが発生した場合、エラーメッセージを返します。
    console.error("Data fetch failed:", error);
    throw createError({
      statusCode: 401,
      statusMessage: "Authorization Error",
    });
  }
}
