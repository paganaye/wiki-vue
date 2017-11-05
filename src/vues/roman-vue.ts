import Vue1 = require('vue');
(Vue1.default as any) = Vue1;
var Vue = Vue1.default;
import Component from "vue-class-component";
import { WikiVue, Property, Schema, vues } from "./wiki-vue";

export interface RomanSchema extends Schema {
    kind: "text";
    clockStyle: boolean;
}

function romanize(num: number, clockStyle: boolean) {
    if (!+num)
        return NaN;
    var digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", clockStyle ? "IIII" : "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

@Component({
    props: ["property", "value"],
    template: `<div>
    <v-text-field
        v-if="editing"
        :label="property.label || (property.schema && (property.schema.label || property.schema.name)) || '???'"
        v-model="inputValue" type="number"></v-text-field>
    <p v-else>{{romanValue}}</p>
</div>`,
    computed: {
        inputValue: {
            get(): string {
                return this.value
            },
            set(val: string) {
                this.$emit('input', val)
            }
        },
        romanValue: function (this: any) {
            return romanize(this.value, this.schema && this.schema.clockStyle);
        }
    }
})
export class RomanVue extends WikiVue<RomanSchema> {
}

Vue.component("roman-vue", RomanVue);
vues.roman = 'roman-vue';

