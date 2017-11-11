import Component from "vue-class-component";
import { WikiVue, Property, Schema, vues, registerWikiVue, SchemaKindMembers } from "./wiki-vue";

export interface RomanSchema extends Schema<number> {
    kind: "text";
    clockStyle: boolean;
}


@Component({
    props: ["property", "value"],
    template: `<div>
    <label>{{property.label||property.name}}</label>
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
        romanValue: function (this: RomanVue) {
            return this.romanize(this.value, this.property.schema.clockStyle);
        }
    }
})
export class RomanVue extends WikiVue<number, RomanSchema> {

    romanize(num: number, clockStyle: boolean): string {
        if (!+num || num >= 5000 || num <= 0)
            return num.toString();
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

    static readonly htmlVueName = "roman-vue";
    static readonly schemaKind = "roman";
    static getSchemaMembers(kinds: SchemaKindMembers[]): void {
    }
}

registerWikiVue(RomanVue);


