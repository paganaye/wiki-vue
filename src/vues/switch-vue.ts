import Vue from 'vue';
eval("vue_1.default=vue_1;");

import Component from "vue-class-component";
import { WikiVue, Property, vues, Schema } from "./wiki-vue";
import { ObjectMember, ObjectSchema } from './object-vue';

export class SwitchSchema implements Schema<any> {
    kind: "switch";
    kinds: { kind: string, members: ObjectMember[] }[]
}

/**

 */
// SwitchVuet
@Component({
    props: ["property", "value", "debug"],
    template: `<div class="switch-vue">
    <div v-if="debug">
        <p>schema:{{property.schema}}</p>
        <p>label:{{property.label}}</p>
        <p>value:{{value}}</p>
        <p>vueType:{{vueType}}</p>
    </div>
    <v-select v-if="editing && property.schema"
        :label="property.label || (property.schema && (property.schema.label || property.schema.name)) || '???'"
        v-model="switchKind" :items="property.schema.kinds"
        item-text="kind"
        item-value="kind"></v-select>
    <object-vue :property="objectProperty" v-model="objectValue" :debug="debug" />  
</div>`,

    beforeUpdate: function (this: SwitchVue) {
        console.log("switch-vue", "beforeUpdate", this);
        if (!this.value || !this.value.kind) {
            this.$emit('input', { kind: "object", members: [] });
        }
    },
    computed: {
        switchKind: {
            get(this: SwitchVue) { return this.value && this.value.kind; },
            set(this: SwitchVue, val: any) {
                this.value.kind = val;
            }
        },
        objectProperty: {
            get(this: SwitchVue): Property<any, any> {
                return {
                    path: "",
                    label: this.property.label,
                    schema: this.getSchema()
                };
            }
        },
        objectValue: {
            get(this: SwitchVue) { return this.value; },
            set(this: SwitchVue, val: any) {
                if (!val) val = {};
                val.kind = this.switchKind;
                this.value = val;
            }
        },
        vueType: function (this: SwitchVue) {

            console.log("calculating switch-vue::vueType");
            console.log("this.property", JSON.stringify(this.property));
            console.log("this.value", JSON.stringify(this.value));

            var property: Property<any, any> = this.property;
            var schema = this.getSchema();
            var result = vues[schema.kind] || "text-field-vue";
            return result;

        }
    }
})
export class SwitchVue extends WikiVue<any, SwitchSchema> {
    switchKind: string;

    getSchema() {
        var rightKinds = this.property.schema.kinds.filter(k => k.kind == this.switchKind);
        if (rightKinds.length > 0) {
            var schema: ObjectSchema = {
                kind: "object",
                members: rightKinds[0].members
            };
        }
        return schema;
    }
}

Vue.component("switch-vue", SwitchVue);
vues.switch = 'switch-vue';
