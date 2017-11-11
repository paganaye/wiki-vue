import Vue from 'vue';
eval("vue_1.default=vue_1;");

import Component from "vue-class-component";

export enum EditMode {
    ParentEditMode,
    Viewing,
    Editing
}

@Component({
    // watch: {
    //     schema: function (this: any) {
    //         console.log("ùùù", "Schema is changing");
    //     },
    //     property: function (this: any) {
    //         console.log("ùùù", "Property is changing");
    //     }
    // },
    computed: {
        editing: function (this: WikiVue<any, any>) {
            var component = this as any;
            while (component != null) {
                var editMode = (component as any).editMode;
                switch (editMode) {
                    case EditMode.Editing: return true;
                    case EditMode.Viewing: return false;
                }
                component = component.$parent;
            }
            return false;
        }
    }
})

export class WikiVue<TValue, TSchema extends Schema<TValue>> extends Vue {
    value: TValue;
    property: Property<TValue, TSchema>;
    editMode: EditMode = EditMode.ParentEditMode;
    props: any;

    constructor() {
        super();
    }
}

export interface Schema<TValue> {
    kind: string;
    defaultValue?: TValue;
}

export interface Property<TValue, TSchema extends Schema<TValue>> {
    path: string;
    label: string;
    schema: TSchema;
}

export var vues: { [key: string]: string } = {};

console.log(Vue);

interface WikiVueClass {
    readonly htmlVueName: string;
    readonly schemaKind: string | string[];
}

export function registerWikiVue(wikiVue: WikiVueClass) {
    var vueName = wikiVue.htmlVueName;
    Vue.component(vueName, wikiVue);

    var schemaKinds = wikiVue.schemaKind;
    if (typeof schemaKinds === "string") schemaKinds = [schemaKinds];
    for (var schemaKind of schemaKinds) {
        vues[schemaKind] = vueName;
    }
}
