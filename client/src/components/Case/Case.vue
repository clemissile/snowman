<template>
    <div v-if="value === 'P'"><v-icon>mdi-human-handsup</v-icon></div>
    <div v-else-if="value === 'L'"><v-icon>mdi-circle-small</v-icon></div>
    <div v-else-if="value === 'M'"><v-icon style="font-size:22pt;">mdi-circle-medium</v-icon></div>
    <div v-else-if="value === 'B'"><v-icon>mdi-circle</v-icon></div>
    <div v-else>{{ value }}</div>
</template>

<script src="./lib/case.js"></script>

<style src="./lib/case.css" scoped></style>