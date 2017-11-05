import Vue1 = require('vue');
(Vue1.default as any) = Vue1;
var Vue = Vue1.default;
import Component from "vue-class-component";
import { WikiVue, Property, vues, Schema } from "./wiki-vue";

export class DynVueSchema implements Schema<any> {
    kind: "string";
    defaultValue: any;
}

// DynVue
@Component({
    props: ["property", "value", "debug"],
    template: `<div>
    <div v-if="debug">
        <p>schema:{{property.schema}}</p>
        <p>label:{{property.label}}</p>
        <p>value:{{value}}</p>
        <p>vueType:{{vueType}}</p>
    </div>
    <component :is="vueType" 
        :property="property" v-model="dynvalue"></component>
</div>`,

    beforeUpdate: function (this: any) {
        console.log("dyn-vue", "beforeUpdate", this);
    },
    computed: {
        dynvalue: {
            get() { return this.value; },
            set(val: any) {
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
            console.log("this.property", JSON.stringify(this.property));
            console.log("this.value", JSON.stringify(this.value));

            var property: Property = this.property;
            var schema = this.getSchema;
            var result = vues[schema.kind] || "text-field-vue";
            return result;

        }
    }
})
export class DynVue extends WikiVue<any, DynVueSchema> {
}


Vue.component("dyn-vue", DynVue);
