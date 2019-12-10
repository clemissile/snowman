<template>
  <v-container>
    <v-row>
      <v-col align="center" justify="center">
        <h1>À propos</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card
                raised
                dark
        >
          <v-card-title class="justify-center">Snowman</v-card-title>

          <v-card-subtitle class="text-center" style="font-style: italic;">Snowman est un jeu visant à empiler des boules de neige pour créer un bonhomme de neige.</v-card-subtitle>

          <v-card-text>
            Vous contrôlez un personnage (<v-icon style="color:red;">mdi-human-handsup</v-icon>) et vous pouvez le déplacer
            sur un plateau à l'aide des touches directionnelles de votre clavier (<v-icon>mdi-arrow-left-bold-box-outline</v-icon>
            <v-icon>mdi-arrow-up-bold-box-outline</v-icon> <v-icon>mdi-arrow-down-bold-box-outline</v-icon> <v-icon>mdi-arrow-right-bold-box-outline</v-icon>).
          </v-card-text>

          <v-card-text>
            Vous pouvez pousser des boules de neiges (<v-icon style="color:cornflowerblue;">mdi-circle-small</v-icon>
            <v-icon style="color:cornflowerblue;">mdi-circle-medium</v-icon> <v-icon style="color:cornflowerblue;">mdi-circle</v-icon>) qui faut empiler dans l'ordre suivant : la moyenne sur la plus grosse et enfin la petite sur les deux autres,
            pour former un bonhomme de neige (<v-icon style="color:cornflowerblue;">mdi-snowman</v-icon>).
          </v-card-text>

          <v-card-text>
            Attention ! Vous ne pouvez plus déplacer des boules qui auraient été empilés. Évidemment, il est impossible de faire sortir les boules
            ou le joueur en dehors du plateau de jeu.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card
                raised
                dark
        >
          <v-card-title class="justify-center">Réalisation</v-card-title>

          <v-card-subtitle class="text-center" style="font-style: italic;">Clément Ganivet (21402554)</v-card-subtitle>

          <v-list class="text-center">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Vuetify</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>VueJS</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>NodeJS</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Stardog</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .img-card {
    width: 75px;
  }
</style>
