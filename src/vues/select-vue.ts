import Component from "vue-class-component";
import { WikiVue, Property, Schema, vues, registerWikiVue } from "./wiki-vue";

export interface SelectItem {
    text: string;
    value: any;
}

export interface SelectSchema extends Schema<string> {
    kind: "select";
    items: any;
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
        v-model="textvalue"></v-text-field>
</div>`,
    beforeUpdate: function (this: any) {
        console.log("select-vue", "beforeUpdate");
    },
    computed: {
        dynvalue: {
            get() {
                return this.value;
            },
            set(val: any) {
                this.$emit('input', val)
            },
        },
        textvalue: function (this: SelectVue) {
            var val = this.value;
            var filtered
            var rightItems = this.property.schema.items.filter((i: SelectItem) => i.value == val);
            if (rightItems.length > 0) {
                return rightItems[0].text || val;
            }
            return val;
        },
        items: function (this: SelectVue) {
            console.log("property", this.property, "value", this.value);
            return this.property.schema.items;
        }
    }
})
export class SelectVue extends WikiVue<string, SelectSchema> {
    static readonly htmlVueName = "select-vue";
    static readonly schemaKind = "select";
}

registerWikiVue(SelectVue);

