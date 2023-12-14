<template>
    <div>
        <div>
            {{ userStore.user?.name?.match(/[A-Z]/g)?.join("") }}
        </div>

        <h3>{{ userStore.user?.name }}</h3>
        <dl>
            <dt>UserName</dt>
            <dd>{{ userStore.user?.username }}</dd>
        </dl>
        <button @click="logout(userStore.user?.homeAccountId)">Logout</button>
    </div>
</template>

<script setup lang="ts">
import { useMSAuth } from "~/composables/useMSAuth";
import { useAppUser } from "~/composables/useAppUser";

const userStore = useAppUser();
const msAuth = useMSAuth();

// Logout処理を実行する
const logout = async (accountId: string | undefined) => {
    if (accountId) {
        await msAuth.signOut(accountId);
    } else {
        console.log("No account id");
    }
};

</script>