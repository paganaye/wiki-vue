import Component from "vue-class-component";
import { WikiVue, Property, Schema, vues, registerWikiVue, ObjectMember, SchemaKindMembers, ObjectSchema, memberMetaSchema } from "./wiki-vue";

// ObjectVue
@Component({
    props: ["property", "value", "debug", "hideLabel"],
    template: `<div>
    <p v-if="!hideLabel">{{property.label}}</p>
    <div v-for="member in members()" v-if="property && property.schema && property.schema.members">
        <dyn-vue 
            :property="dynProperty(member, value)" v-model="value[member.name]" />
    </div>
</div>`,
    beforeCreate: function (this: any) {
        console.log("object-vue", "beforeCreate");
    },

    mounted: function (this: any) {
        console.log("object-vue", "mounted", "value", this.value);
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
    static readonly htmlVueName = "object-vue";
    static readonly schemaKind = "object";
    static getSchemaMembers(kinds: SchemaKindMembers[]): void {
        kinds.push({
            kind: "object", members: [
                {
                    name: "members", schema: {
                        kind: "table",
                        itemsSchema: memberMetaSchema,
                        itemsTemplate: "<span>{{name}}</span>"
                    } as any
                }
            ]
        });
    }
}
registerWikiVue(ObjectVue);


