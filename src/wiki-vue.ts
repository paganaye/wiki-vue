import Vue1 = require('vue');
(Vue1.default as any) = Vue1;
var Vue = Vue1.default;
import Component from "vue-class-component";

@Component({})
export class WikiVue extends Vue {
}
export interface Schema {
    kind: string;
}
export interface Property {
    path: string;
    label: string;
    schema: Schema;
}
console.log("he");

export var vues: { [key: string]: string } = {};

export function isEditing(component: any): boolean {
    while (component) {
        if ((component as any).isEditable) return (component as any).editing;
        component = component.$parent;
    }
    return false;
}
