import Vue from 'vue';
eval("vue_1.default=vue_1;");

import Component from "vue-class-component";
import { WikiVue, Property, vues, Schema } from "./wiki-vue";
import { ObjectMember, ObjectSchema } from './object-vue';

export class SwitchSchema implements Schema<any> {
    kind: "switch";
    kinds: { kind: string, members: ObjectMember[] }[]
}

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
        label="type"
        v-model="switchKind" :items="property.schema.kinds"
        item-text="kind"
        item-value="kind"></v-select>
    <v-text-field v-else
        readonly
        label="type"
        v-model="switchKind"></v-text-field>
    
    <object-vue :property="objectProperty" v-model="objectValue" :debug="debug" />  
</div>`,

    mounted: function (this: SwitchVue) {
        console.log("switch-vue", "mounted", this);
        if (!this.value || !this.value.kind) {
            this.$emit('input', { kind: "object", members: [] });
        }
    },
    computed: {
        switchKind: {
            get(this: SwitchVue) { return this.value && this.value.kind; },
            set(this: SwitchVue, val: any) {
                this.$set(this.value, "kind", val);
            }
        },
        objectProperty: {
            get(this: any): Property<any, any> {
                return {
                    path: "",
                    label: this.property.label,
                    schema: this.getSchema()
                };
            }
        },
        objectValue: {
            get(this: any) { return this.value; },
            set(this: any, val: any) {
                if (!val) val = {};
                val.kind = this.switchKind;
                this.value = val;
            }
        },
        vueType: function (this: any) {

            console.log("calculating switch-vue::vueType");
            console.log("this.property", JSON.stringify(this.property));
            console.log("this.value", JSON.stringify(this.value));

            var property: Property<any, any> = this.property;
            var schema = this.getSchema();
            var result = vues[schema.kind] || "text-field-vue";
            return result;

        }
    },
    methods: {
        getSchema: function (this: any) {
            var rightKinds = this.property.schema.kinds.filter((k: Schema<any>) => k.kind == this.switchKind);
            if (rightKinds.length > 0) {
                var schema: ObjectSchema = {
                    kind: "object",
                    members: rightKinds[0].members
                };
            }
            return schema;
        }
    }

})
export class SwitchVue extends WikiVue<any, SwitchSchema> {

}

Vue.component("switch-vue", SwitchVue);
vues.switch = 'switch-vue';
