//import Vue from 'vue';
//eval("vue_1.default=vue_1;");

import Component from "vue-class-component";
import { WikiVue, Property, Schema, vues, registerWikiVue, SchemaKindMembers } from "./wiki-vue";

export interface TextFieldSchema extends Schema<any> {
    kind: "text";
}

@Component({
    props: ["property", "value"],
    template: `<div>
    <v-text-field
        :readonly="!editing"
        :label="property.label || (property.schema && (property.schema.label || property.schema.name)) || '???'"
        v-model="inputValue" :type="inputType"></v-text-field>
</div>`,
    beforeUpdate: function (this: any) {
        console.log("text-field-vue", "beforeUpdate");
    },
    computed: {
        inputType: function (this: any) {
            var property = (this.property as Property<any, any>);
            var kind = property.schema && property.schema.kind;
            switch (kind) {
                case 'number':
                case 'color':
                case 'date':
                case 'datetime-local':
                case 'email':
                case 'month':
                case 'range':
                case 'search':
                case 'tel':
                case 'time':
                case 'url':
                case 'week':
                    console.log("input-type", kind)
                    return kind;
                default:
                    return 'text'
            }
        },
        inputValue: {
            get(): string {
                var val = this.value;
                switch (typeof val) {
                    case "object":
                        val = JSON.stringify(val);
                }
                return val;
            },
            set(val: string) {
                this.$emit('input', val)
            }
        }
    }
})
export class TextFieldVue extends WikiVue<any, TextFieldSchema> {
    static readonly htmlVueName = "text-field-vue";
    static readonly schemaKind = ["string", "number"];
    static getSchemaMembers(kinds: SchemaKindMembers[]): void {
        kinds.push({
            kind: "string", members: [
                { name: "maxLength", schema: { kind: "number" } }]
        });
        kinds.push({
            kind: "number", members: [
                { name: "minValue", schema: { kind: "number" } },
                { name: "maxValue", schema: { kind: "number" } }]
        });
        kinds.push({
            kind: "email", members: []
        });
    }
}

registerWikiVue(TextFieldVue);
