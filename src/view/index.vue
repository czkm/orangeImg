<template>
    <div>{{ userStore.name }}</div>
    <n-space>
        <n-button>Default</n-button>
        <n-button type="tertiary"> Tertiary </n-button>
        <n-button type="primary"> Primary </n-button>
        <n-button type="info"> Info </n-button>
        <n-button type="success"> Success </n-button>
        <n-button type="warning"> Warning </n-button>
        <n-button type="error"> Error </n-button>
    </n-space>
</template>

<script lang="ts" setup>
import { usInfoStore } from '@/store/info';

const userStore = usInfoStore();
</script>
