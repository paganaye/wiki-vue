import * as Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);


Vue.component("cmpOne", {
    props: ["userName"],
    template: `<div>
    <h3>hi {{userName}}</h3>
    <div class="text-xs-center">
    <v-badge right>
      <span slot="badge">1</span>
      <span>Examples here</span>
    </v-badge>      
  </div></div>`
});


new Vue({
    el: "#app",
    template: `<div id='app'>
    <h1>it works</h1>
    <p>data.x: {{x}}</p>
    <cmpOne userName="Pascal"><cmpOne>
</div>`,
    data: { x: 123 }
});
