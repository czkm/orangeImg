<template>
    <div>{{ userStore.name }}</div>
</template>

<script lang="ts" setup>
import { usInfoStore } from '@/store/info';

const userStore = usInfoStore();
</script>
