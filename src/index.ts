import * as Vue from 'vue';
import Vuetify from 'vuetify';
import Sortable = require('sortablejs');
/*---*/
import * as firebase from 'firebase';
import * as Auth from "./auth";

console.log("auth", Auth);

Vue.use(Vuetify);



const env = {
    currentDocument: window.location.hash,
    drawer: true,
    it1: "this is it1",
    source: "hi"
};


Vue.component("select-vue", {
    props: ["label", "value", "type", "env", "currentDocument"],
    template: `<div>    
<v-card>
    <div class="headline pa-4">Headline</div>
    <div class="pl-4 pr-4">Some text here with  wrapping {{currentDocument}}</div>
    <v-card-actions>
        <v-btn flat color="teal" value="recent" @click="b1">
            <span>OK</span>
        </v-btn>
    </v-card-actions>        
</v-card>
</div>`,

    data: () => {
        return {
            select: [],
            items: [
                'Programming',
                'Design',
                'Vue',
                'Vuetify'
            ]
        }
    },
    methods: {
        b1: () => {
            alert("b1");
        },
        b2: () => {
            alert("b2");
        }
    }
});


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
                    <select-vue :currentDocument="currentDocument"></select-vue>                                                        
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
