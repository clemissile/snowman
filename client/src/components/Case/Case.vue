<template>
    <div v-if="value === 'P'" class="cell" id="player"><v-icon>mdi-human-handsup</v-icon></div>

    <div v-else-if="value === 'L'" class="cell ball"><v-icon style="font-size:22pt;">mdi-circle-medium</v-icon></div>

    <div v-else-if="value === 'M'" class="cell ball"><v-icon style="font-size:42pt;">mdi-circle-medium</v-icon></div>

    <div v-else-if="value === 'B'" class="cell ball"><v-icon style="font-size:25pt;">mdi-circle</v-icon></div>

    <div v-else-if="value === 'LM'" class="cell ball">
        <img src="../../assets/littlemedium.png" alt="LM"/>
    </div>

    <div v-else-if="value === 'MB'" class="cell ball">
        <img src="../../assets/mediumbig.png" alt="MB"/>
    </div>

    <div v-else-if="value === 'LMB'" class="cell ball"><v-icon>mdi-snowman</v-icon></div>
    <div v-else class="cell">{{ value }}</div>
</template>

<script src="./lib/case.js"></script>

<style src="./lib/case.css" scoped></style>