import * as Vue from 'vue';
import Vuetify from 'vuetify';
import Sortable = require('sortablejs');
/*---*/
import * as firebase from 'firebase';

Vue.use(Vuetify);


Vue.component("select-vue", {
    props: ["label", "value", "type"],
    template: `<div>    
    
    <v-card>
        <div class="headline text-xs-center pa-4">Headline</div>
            <div class="pa-5">
                <v-select v-model="select1"
                label="Select a favorite activity or create a new one"
                multiple tags :items="items" />
            <v-select v-model="select2"
                label="Select a favorite activity or create a new one"
                :items="items" />
            <v-text-field v-model="input1"
                label="Select a favorite activity or create a new one"
                :items="items" />
        </div>
        <v-card-acions>
            <v-btn flat color="teal" value="recent">
                <span>Recent</span>
                <v-icon>history</v-icon>
            </v-btn>
            <v-btn primary flat>
                <span>Stop</span>
                <v-icon>history</v-icon>
            </v-btn>
        </v-card-acions>
      
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
    }
});


var app = new Vue({
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
        <v-list-tile @click="javascript:alert(1)">
            <v-list-tile-action>
                <v-icon>dashboard</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>Dashboard</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="alert(3)">
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
        </v-toolbar>
    <main>
        <v-content>
            <v-container fluid fill-height>
                <v-layout justify-center align-center>
                <select-vue></select-vue>                

                </v-layout>
            </v-container>
        </v-content>
    </main>
    <v-footer app fixed>
    <span>&copy; 2017</span>
    </v-footer>
</v-app>
</div>`,
    data: {
        drawer: true,
        it1: "this is it1",
        source: "hi"
    }
});
