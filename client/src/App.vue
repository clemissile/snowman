<template>
  <v-app>
    <v-app-bar
            dense
            dark
            app
    >
      <v-toolbar-title>
        <span>PROJET</span>
        <span class="font-weight-light">Snowman</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items
              v-for="item in items"
              :key="item.title"
      >
        <v-btn text :to="item.link">{{ item.title }}</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

  export default {
    name: 'App',
    components: {

    },
    mounted() {
    },
    data () {
      return {
        items: [
          { title: 'Jeu', link: '/' },
          { title: 'À propos', link: '/about' }
        ]
      }
    }
  };
</script>

<style>
  nav, .container {
    font-family: "Alegreya Sans", sans-serif;
  }

  a {
    font-family: 'Alegreya Sans', sans-serif;
    text-decoration: none;
    color: #005085;
  }

  a:hover {
    color: #5dc596;
  }
</style>
