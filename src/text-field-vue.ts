import Vue1 = require('vue'); 
(Vue1.default as any) = Vue1; 
var Vue = Vue1.default;
import Component from "vue-class-component";
import { WikiComponent, Property } from "./wiki-component";

@Component({
    props: ["property", "value"],
    template: `<div>
    <v-text-field
        :label="property.label || (property.schema && (property.schema.label || property.schema.name)) || '???'"
        v-model="inputValue" :type="inputType"></v-text-field>
</div>`,
    beforeUpdate: function (this: any) {
        console.log("text-field-vue", "beforeUpdate");
    },
    computed: {
        inputType: function (this: any) {
            var property = (this.property as Property);
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
                return this.value
            },
            set(val: string) {
                console.log("he")
                this.lazyValue = val
                this.$emit('input', val)
            }
        }
    }
})
export class TextFieldVue extends WikiComponent {
}
Vue.component("text-field-vue", TextFieldVue);