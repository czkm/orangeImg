<script setup lang="ts">
import Index from '@/view/index.vue';
import Message from './components/Message.vue';
import { NMessageProvider } from "naive-ui";

</script>

<template>
    <n-message-provider>
        <Message />
    </n-message-provider>
    <index />
</template>

<style></style>
