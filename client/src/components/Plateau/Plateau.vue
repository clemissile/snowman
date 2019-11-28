<template>
    <div class="plateau">
        <div v-for="(ligne, index) in grille" :key="`l-${index}`">
            <v-row class="ma-0">
                <v-col cols="12" class="pa-0">
                    <div class="d-flex flex-row">
                        <Case v-for="(item, index) in ligne" :key="`i-${index}`" :value="item" />
                    </div>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script src="./lib/plateau.js"></script>

<style src="./lib/plateau.css" scoped></style>