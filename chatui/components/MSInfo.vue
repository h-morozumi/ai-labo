<template>
    <h2>Auth Info</h2>
    <div>
        <button @click="callapi">callapi</button>
    </div>
    <div v-if="isAuthenticated">
        <div v-if="userStore.user">
            <ul>
                <li>homeAccountId:{{ userStore.user.homeAccountId }}</li>
                <li>environment:{{ userStore.user.environment }}</li>
                <li>tenantId:{{ userStore.user.tenantId }}</li>
                <li>username:{{ userStore.user.username }}</li>
                <li>localAccountId:{{ userStore.user.localAccountId }}</li>
                <li>name:{{ userStore.user.name }}</li>
                <li>authorityType:{{ userStore.user.authorityType }}</li>
                <li>idToken:{{ userStore.user.idToken }}</li>
                <li>nativeAccountId:{{ userStore.user.nativeAccountId }}</li>
                <li>authorityType:{{ userStore.user.authorityType }}</li>
                <li>tenantProfiles:{{ userStore.user.tenantProfiles }}</li>
                <!-- <li>bearerToken:{{ userStore.user.bearerToken }}</li> -->
                <li>accessToken:{{ accessToken }}</li>

                <li>idTokenClaims aud:{{ userStore.user.idTokenClaims?.aud }}</li>
                <li>idTokenClaims iss:{{ userStore.user.idTokenClaims?.iss }}</li>
                <li>idTokenClaims iat:{{ userStore.user.idTokenClaims?.iat }}</li>
                <li>idTokenClaims nbf:{{ userStore.user.idTokenClaims?.nbf }}</li>
                <li>idTokenClaims exp:{{ userStore.user.idTokenClaims?.exp }}</li>
                <li>idTokenClaims idp:{{ userStore.user.idTokenClaims?.idp }}</li>
                <li>idTokenClaims name:{{ userStore.user.idTokenClaims?.name }}</li>
                <li>idTokenClaims nonce:{{ userStore.user.idTokenClaims?.nonce }}</li>
                <li>idTokenClaims oid:{{ userStore.user.idTokenClaims?.oid }}</li>
                <li>idTokenClaims preferred_username:{{ userStore.user.idTokenClaims?.preferred_username }}</li>
                <li>idTokenClaims rh:{{ userStore.user.idTokenClaims?.rh }}</li>
                <li>idTokenClaims sub:{{ userStore.user.idTokenClaims?.sub }}</li>
                <li>idTokenClaims tid:{{ userStore.user.idTokenClaims?.tid }}</li>
                <li>idTokenClaims uti:{{ userStore.user.idTokenClaims?.uti }}</li>
                <li>idTokenClaims ver:{{ userStore.user.idTokenClaims?.ver }}</li>
            </ul>
        </div>
        <div>
            <textarea rows="50" cols="100">{{ JSON.stringify(userStore.user, null, 2) }}</textarea>
        </div>
        <div>
            <h2>Graph Response</h2>
            <div>
                <textarea rows="50" cols="100">{{ graphResponse }}</textarea>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useMSAuth } from "~/composables/useMSAuth";
import { useAppUser } from "~/composables/useAppUser";

const userStore = useAppUser();
const msAuth = useMSAuth();
const isAuthenticated = msAuth.isAuthenticated();

const graphResponse = ref<string|null>("");
const accessToken = ref<string | null>(""); 

onMounted(async () => {
    const acquireTokenSilent = await msAuth.acquireTokenSilent();
    accessToken.value = acquireTokenSilent;
});

// APIを呼ぶテスト。Bearerを付与してAPI側でチェックするサンプル
const callapi = async () => {
    // Token は毎回新たに取得新たに取得する
    const token = await msAuth.acquireTokenSilent();
    const { data } = await useFetch(`/api/azure`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Bearerトークンを使ってGraphAPIを読んだ結果（確認用）
    graphResponse.value = JSON.stringify(data.value, null, 2);
};
</script>