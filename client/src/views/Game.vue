<template>
  <v-container>
    <v-row align="center" justify="center">
        <Plateau :grille="grille"/>
    </v-row>
    <v-row align="center" justify="center">
        <v-btn class="mt-5" v-on:click="reset">Reset</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import Plateau from "../components/Plateau/Plateau.vue";

export default {
  name: 'game',
  data: function () {
    return {
      grille: null,
      isMoving: false
    }
  },
  components: {
    Plateau
  },
  methods: {
    queryNodeServer: function(query, callback) {
      return fetch('http://localhost:8081/'+query).then(function (res) {
        res.json().then(function(data) {
          callback(data);
        })
      })
    },
    loadGame: function() {
      let self = this;
      this.queryNodeServer('afficheJeu', function (data) {
        self.isMoving = false;
        self.grille = data;
      });
    },
    move: function (direction) {
      if (!this.isMoving) {
        this.isMoving = true;
        this.queryNodeServer('move?d='+direction, this.loadGame);
      } else {
        console.log("déjà en mouvement");
      }
    },
    reset: function (ev) {
      this.queryNodeServer('reset', this.loadGame);
    }
  },
  mounted() {
    this.loadGame();
    window.addEventListener('keydown', (e)=> {
      const key = e.which || e.keyCode;
      switch (key) {
        case 38:
          this.move("North");
          break;
        case 40:
          this.move("South");
          break;
        case 37:
          this.move("West");
          break;
        case 39:
          this.move("East");
          break;
      }
    });
  }
}
</script>
