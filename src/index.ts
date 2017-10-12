import * as Vue from 'vue';
import Vuetify from 'vuetify';

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

Vue.component("value-vue", {
    props: ["label", "value", "type"],
    template: `<div>
    <!--p>type {{type}}, label:{{label}}, value:{{value}}</p-->
    <v-text-field
        :label="label || (type && (type.label || type.name)) || '???'"
        v-model="value"></v-text-field>
</div>`
});

Vue.component("object-vue", {
    props: ["label", "value", "type"],
    template: `<div>
    <p>{{label}}</p>
    <!--p>type {{type}}, label:{{label}}, value:{{value}}</p-->
    <div v-for="prop in type.properties">
        <dyn-vue :type='prop.type' :label='prop.label || prop.name' :value='value[prop.name]' />
    </div>
</div>`
});

Vue.component("array-vue", {
    props: ["label", "value", "type"],
    template: `<div>
    <p>{{label}}</p>
    <div v-for="(item, index) in value">
        <dyn-vue :label="'#' + index" :type='type && type.innerType || {}' :value='item' />
    </div>    
</div>`
});

Vue.component("dyn-vue", {
    props: ["label", "value", "type"],
    template: `<div>
    <array-vue  :label="label" :type="type" :value="value" v-if="Array.isArray(value)" />
    <object-vue :label="label" :type="type" :value="value" v-else-if="typeof value === 'object' && !Array.isArray(value)" />
    <value-vue  :label="label" :type="type" :value="value" v-else />
</div>`
});


new Vue({
    el: "#app",
    template: `<div id='app'>
    <h1>it works</h1>
    <p>data.it1: {{it1}}</p>    
    
    <h3>it 1</h3>
    <cmpOne email="ABC" />
    
    <h3>it 2</h3>
    <value-vue :type='it2type' value="it2value" />
    
    <h3>it 3</h3>
    <object-vue :type="it3type" :value="it3value" />
    
    <h3>it 4</h3>
    <p>it4: {{it4}}</p>
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
