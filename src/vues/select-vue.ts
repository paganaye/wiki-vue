import Vue1 = require('vue'); 
(Vue1.default as any) = Vue1; 
var Vue = Vue1.default;
import Component from "vue-class-component";
import { WikiVue, Property, Schema, vues } from "./wiki-vue";

export interface SelectSchema extends Schema {
    kind: "select";
}

// SelectVue
@Component({
    props: ["property", "value"],
    template: `<div>
    <v-select
        :label="property.label || (property.schema && (property.schema.label || property.schema.name)) || '???'"
        v-model="dynvalue" :items="items"></v-select>
</div>`,
    beforeUpdate: function (this: any) {
        console.log("select-vue", "beforeUpdate");
    },
    computed: {
        dynvalue: {
            get() { return this.value; },
            set(val: any) {
                this.$emit('input', val)
            }
        },
        items: function (this: any) {
            console.log("property", this.property, "value", this.value);
            return this.property.schema.list;
        }
    }
})
export class SelectVue extends WikiVue {
}
Vue.component("select-vue", SelectVue);
vues.select = 'select-vue';
