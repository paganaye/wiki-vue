import Vue1 = require('vue');
(Vue1.default as any) = Vue1;
var Vue = Vue1.default;
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
        editing: function (this: WikiVue<any>) {
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

export class WikiVue<TSchema extends Schema> extends Vue {
    property: Property;
    schema: TSchema;
    editMode: EditMode = EditMode.ParentEditMode;

    constructor() {
        super();
    }
}

export interface Schema {
    kind: string;
}

export interface Property {
    path: string;
    label: string;
    schema: Schema;
}

export var vues: { [key: string]: string } = {};
