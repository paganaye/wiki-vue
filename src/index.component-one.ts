import * as Vue from 'vue';
import Vuetify from 'vuetify';
import Sortable = require('sortablejs');

Vue.use(Vuetify);

Vue.component("cmpOne", {
    props: ["userName", "email"],
    data: () => {
        return {
            'emailRules': [
                (v: any) => !!v || 'E-mail is required',
                (v: any) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
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
    <v-form>
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
    <h3>it 3</h3>
    <object-vue :type="it3type" :value="it3value" />

</div>`,
    data: {
        it1: "this is it1",
        it2type: {
            label: "hello"
        },
        it2value: "abc",
        it3type: {
            kind: "object",
            properties: [
                { name: "A", label: "first A" },
                { name: "B", label: "then B" },
                { name: "C" }
            ]
        },
        it3value: { A: "hello", B: "world", C: ["1", "2", "3"] },
        it4: "aa"
    }
});
