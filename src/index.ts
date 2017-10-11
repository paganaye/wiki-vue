import * as Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);


Vue.component("cmpOne", {
    props: ["userName"],
    data: () => {
        return {
            'emailRules': [
                (v) => !!v || 'E-mail is required',
                (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
            ]
        }
    },
    template: `<div>
    <h3>hi {{userName}}</h3>
    <div class="text-xs-center">
        <v-badge right>
            <span slot="badge">1</span>
            <span>Examples here</span>
        </v-badge>      
    </div>
    <v-form v-model="valid">
        <v-text-field
            label="Name"
            v-model="name"
            :rules="nameRules"
            :counter="10"
            required></v-text-field>
        <v-text-field
            label="E-mail"
            v-model="email"
            :rules="emailRules"
            required></v-text-field>
    </v-form>
  </div>`
});


new Vue({
    el: "#app",
    template: `<div id='app'>
    <h1>it works</h1>
    <p>data.x: {{x}}</p>    
    
    <h3>it 1</h3>
    <cmpOne />
    
    <h3>it 2</h3>
    <p>data.x: {{x}}</p>
    
    <h3>it 3</h3>
    <p>data.x: {{x}}</p>
    
    <h3>it 4</h3>
    <p>data.x: {{x}}</p>
</div>`,
    data: { x: 123 }
});
