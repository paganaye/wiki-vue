import Vue from 'vue';
Vue;
eval("vue_1.default=vue_1;");
import Component from "vue-class-component";
import { WikiVue, Property, vues, Schema } from "./wiki-vue";

// DynVue
@Component({
    props: ["property", "value", "debug"],
    template: `<div>
    <div v-if="debug">
        <p>schema:{{property.schema}}</p>
        <p>label:{{property.label}}</p>
        <p>value:{{dynValue}}</p>
        <p>vueType:{{vueType}}</p>
    </div>
    <component :is="vueType" 
        :property="property" v-model="dynValue"></component>
</div>`,

    beforeUpdate: function (this: any) {
        console.log("dyn-vue", "beforeUpdate", this);
    },
    computed: {
        dynValue: {
            get: function (this: any) {
                return this.value;
            },
            set: function (this: any, val: any) {
                this.$emit('input', val)
            }
        },
        getSchema: function (this: any) {
            var schema = this.property.schema;
            if (schema) return schema;

            if (Array.isArray(this.value)) schema = { kind: "array" };
            else if (typeof this.value === "object") schema = { kind: "object" };
            else schema = { kind: "string" };

            return schema;
        },
        vueType: function (this: any) {

            console.log("calculating dyn-vue::vueType");
            //console.log("this.property", JSON.stringify(this.property));
            console.log("this.value", JSON.stringify(this.value));

            var property: Property<any, any> = this.property;
            var schema = this.getSchema;
            var result = vues[schema.kind] || "text-field-vue";
            return result;

        }
    }
})
export class DynVue extends Vue {
}

Vue.component("dyn-vue", DynVue);
