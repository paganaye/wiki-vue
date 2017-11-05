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
            if (this.editMode == EditMode.ParentEditMode) {
                var component = (this as any).$parent;
                return (component ? component.editing : false);
            } else return this.editMode == EditMode.Editing;
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

