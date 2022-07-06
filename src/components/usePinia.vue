<template>
    <div>{{ userStore.name }}</div>
</template>

<script lang="ts" setup>
import { useInfoStore } from '@/store/info';

const userStore = useInfoStore();
</script>
