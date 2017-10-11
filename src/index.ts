import * as Vue from 'vue';

Vue.component("cmpOne", {
    props: ["userName"],
    template: '<p>hi {{userName}}</p>'
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
