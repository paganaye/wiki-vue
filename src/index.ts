import * as Vue from 'vue';

Vue.component("cmpOne", {
    template:'<p>hi</p>'

});

new Vue({
    el: "#app",
    template: `<div id='app'>
    <h1>it works</h1>
    <cmpOne><cmpOne>
</div>`
});
