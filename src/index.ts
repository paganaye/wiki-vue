import * as Vue from 'vue';
import Vuetify from 'vuetify';
import * as Auth from "./auth";
import * as Wiki from "./wiki";

Vue.use(Vuetify);

// this console log avoids the tree shaking
console.log(Auth, Wiki);

const env = {
    currentDocument: window.location.hash,
    drawer: false,
    source: "hi"
};

const app = new Vue({
    el: "#app",
    template: `<div id='app'>
<v-app>
    <v-navigation-drawer
        clipped
        persistent
        v-model="drawer"
        enable-resize-watcher
        app>
    <v-list dense>
        <v-list-tile>
            <v-list-tile-action>
                <v-icon>dashboard</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>Dashboard</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
            <v-list-tile-action>
                <v-icon>settings</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>Settings</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
    </v-list>
    </v-navigation-drawer>
        <v-toolbar app fixed clipped-left>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Application</v-toolbar-title>
            <v-spacer></v-spacer>
          <auth-toolbar-vue />        
        </v-toolbar>
    <main>
        <v-content>
            <v-container fluid fill-height>
                <v-layout justify-center align-center>
                    <wiki-vue :document="currentDocument">
                    </wiki-vue>
                </v-layout>
            </v-container>
        </v-content>
    </main>
    <v-footer app fixed>
    <span>&copy; 2017</span>
    </v-footer>
</v-app>
</div>`,
    data: () => env
});

window.addEventListener('popstate', () => {
    env.currentDocument = window.location.hash;
})
