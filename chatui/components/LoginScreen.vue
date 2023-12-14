<template>
    <div>
        <h2>
            Microsoft Authentication Library (MSAL) with Nuxt 3
        </h2>
        <div>
            <div>
                <button type="submit" @click="login">
                    <span>Login with Microsoft 365</span>
                </button>
            </div> 
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { useMSAuth } from "~/composables/useMSAuth";

const msAuth = useMSAuth();

const login = async () => await msAuth.signIn(); 
</script>
