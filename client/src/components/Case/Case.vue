<template>
    <div v-if="value === 'P'"><v-icon>mdi-human-handsup</v-icon></div>
    <div v-else>{{ value }}</div>
</template>

<script src="./lib/case.js"></script>

<style src="./lib/case.css" scoped></style>