import Vue from 'vue';
eval("vue_1.default=vue_1;");

import Component from "vue-class-component";
import { WikiVue, Property, Schema, vues } from "./wiki-vue";

export interface SelectSchema extends Schema<string> {
    kind: "select";
    list: any;
}

// SelectVue
@Component({
    props: ["property", "value"],
    template: `<div>
    <v-select v-if="editing"
        :label="property.label || (property.schema && (property.schema.label || property.schema.name)) || '???'"
        v-model="dynvalue" :items="items"
        item-text="text"
        item-value="value"></v-select>
    <v-text-field v-else
        readonly
        :label="property.label || (property.schema && (property.schema.label || property.schema.name)) || '???'"
        v-model="dynvalue"></v-text-field>
</div>`,
    beforeUpdate: function (this: any) {
        console.log("select-vue", "beforeUpdate");
    },
    computed: {
        dynvalue: {
            get() {
                if (typeof this.value === "object" && this.value.text) {
                    return this.value.text;
                }
                return this.value;
            },
            set(val: any) {
                if (typeof val === "object" && val.text) {
                    val = val.text;
                }
                this.$emit('input', val)
            }
        },
        items: function (this: SelectVue) {
            console.log("property", this.property, "value", this.value);
            return this.property.schema.list;
        }
    }
})
export class SelectVue extends WikiVue<string, SelectSchema> {
}
Vue.component("select-vue", SelectVue);
vues.select = 'select-vue';
