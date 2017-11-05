import Vue from 'vue';
eval("vue_1.default=vue_1;");

import Component from "vue-class-component";
import { WikiVue, Property, Schema, vues } from "./wiki-vue";

export interface ObjectSchema extends Schema<any> {
    kind: "object";
    members: ObjectMember[];
}

export interface ObjectMember {
    label: string;
    name: string;
    schema: Schema<any>;
}

// ObjectVue
@Component({
    props: ["property", "value", "debug"],
    template: `<div>
    <p>{{property.label}}</p>
    <div v-for="member in members()" v-if="property && property.schema && property.schema.members">
        <dyn-vue 
            :property="dynProperty(member, value)" v-model="value[member.name]" />
    </div>
</div>`,
    beforeCreate: function (this: any) {
        console.log("object-vue", "beforeCreate");
    },

    beforeUpdate: function (this: any) {
        console.log("object-vue", "beforeUpdate", "value", this.value);
        if (!this.value) {
            this.$emit('input', {})
        }
    },
    methods: {
        members: function (this: any) {
            if (this.property && this.property.schema && this.property.schema.members) {
                return this.property.schema.members;
            } else return [];
        },
        dynProperty: function (this: any, member: ObjectMember, objectValue: any) {
            if (objectValue == null) objectValue = {};
            var itemValue = objectValue[member.name];
            return {
                schema: member.schema,
                label: member.label || member.name
            }
        },
        memberValue: function (this: any, member: ObjectMember, objectValue: any) {
            if (objectValue == null) objectValue = {};
            var itemValue = objectValue[member.name];
            return itemValue;
        }
    }
})
export class ObjectVue extends WikiVue<any, ObjectSchema> {
}
Vue.component("object-vue", ObjectVue);
vues.object = 'object-vue';

