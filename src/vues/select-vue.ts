import Vue1 = require('vue');
(Vue1.default as any) = Vue1;
var Vue = Vue1.default;
import Component from "vue-class-component";
import { WikiVue, Property, Schema, vues, isEditing } from "./wiki-vue";

export interface SelectSchema extends Schema {
    kind: "select";
}

// SelectVue
@Component({
    props: ["property", "value"],
    template: `<div>
    <v-select v-if="editing"
        :label="property.label || (property.schema && (property.schema.label || property.schema.name)) || '???'"
        v-model="dynvalue" :items="items"></v-select>
    <v-text-field v-else
        readonly
        :label="property.label || (property.schema && (property.schema.label || property.schema.name)) || '???'"
        v-model="dynvalue"></v-text-field>
</div>`,
    beforeUpdate: function (this: any) {
        console.log("select-vue", "beforeUpdate");
    },
    computed: {
        editing: function (this: any) {
            return isEditing(this);
        },
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
