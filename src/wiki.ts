import * as Vue from 'vue';
import Vuetify from 'vuetify';

import * as firebase from 'firebase';

Vue.component("wiki-vue", {
    props: ["document"],
    template: `<div>Loading {{document}}</div>`,
    data: () => {
        return {
        };
    },
    methods: {
    },
    created() {
    }
});


