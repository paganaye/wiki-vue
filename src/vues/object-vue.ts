import Vue1 = require('vue');
(Vue1.default as any) = Vue1;
var Vue = Vue1.default;
import Component from "vue-class-component";
import { WikiVue, Property, Schema, vues } from "./wiki-vue";

export interface ObjectSchema extends Schema {
    kind: "object";
    properties: ObjectProperty[];
}
export interface ObjectProperty {
    label: string;
    name: string;
    schema: Schema;
}

// ObjectVue
@Component({
    props: ["property", "value", "debug"],
    template: `<div>
    <p>{{property.label}}</p>
    <div v-for="prop in properties()" v-if="value && property && property.schema && property.schema.properties">
        <dyn-vue 
            :property="dynProperty(prop, value)" v-model="value[prop.name]" />
    </div>
</div>`,
    beforeCreate: function (this: any) {
        console.log("object-vue", "beforeCreate", "value", this.value);
        
        if (!this.value) {
            this.$emit('input', {})
        }
    },
    created: function (this: any) {
        console.log("object-vue", "created", "value", this.value);
        if (!this.value) {
            this.$emit('input', {})
        }
    },
    mounted: function (this: any) {
        console.log("object-vue", "mounted", "value", this.value);
        if (!this.value) {
            this.$emit('input', {})
        }
    },
    activated: function (this: any) {
        console.log("object-vue", "activated", "value", this.value);
        if (!this.value) {
            this.$emit('input', {})
        }
    },
    beforeUpdate: function (this: any) {
        console.log("object-vue", "beforeUpdate", "value", this.value);

    },
    methods: {
        properties: function (this: any) {
            if (this.property && this.property.schema && this.property.schema.properties) {
                return this.property.schema.properties;
            } else return [];
        },
        dynProperty: function (this: any, prop: any, objectValue: any) {
            if (objectValue == null) objectValue = {};
            var itemValue = objectValue[prop.name];
            if (itemValue == null) {
                switch (prop.schema.kind) {
                    case "array":
                        itemValue = [];
                        break;
                    case "object":
                        itemValue = {};
                        break;
                }
                objectValue[prop.name] = itemValue;
            }
            return {
                schema: prop.schema,
                label: prop.label || prop.name,
                value: itemValue
            }
        },
        memberValue: function (this: any, prop: any, objectValue: any) {
            if (objectValue == null) objectValue = {};
            var itemValue = objectValue[prop.name];
            return itemValue;
        }
    }
})
export class ObjectVue extends WikiVue {
}
Vue.component("object-vue", ObjectVue);
vues.object = 'object-vue';

