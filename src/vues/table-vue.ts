import Vue from 'vue';
eval("vue_1.default=vue_1;");
import Component from "vue-class-component";
import { WikiVue, Property, Schema, vues, registerWikiVue } from "./wiki-vue";
//import { DynTemplate } from './dyn-template';

declare function require(name: string): any;
var draggable = require('vuedraggable');
Vue.component("draggable", draggable.default);

var Loading = {
    template: `<div>Loading...</div>`
}
var dynamic = {
    functional: true,
    props: {
        template: String,
        data: { type: Object, default: () => ({}) }
    },
    render(h: any, context: any) {
        const template = context.props.template;
        const dynComponent = {
            template,
            data() { return context.props.data }
        }
        const component = template ? dynComponent : Loading;
        return h(component);
    }
};


export interface TableSchema<TItemType> extends Schema<TItemType[]> {
    kind: "table";
    itemsSchema: Schema<TItemType>;
    itemsTemplate: string;
}
//console.log(DynTemplate);
// TableVue
@Component({
    props: ["property", "value"],
    components: {
        draggable, dynamic
    },
    template: `<div>
    <label>{{property.label||property.name}}</label>
    <table class="table">
        <draggable :list="value" id="list" ref="list" 
            :options='{handle:".table-row-handle", onStart:"onStart", onEnd:"onEnd"}'
            element="tbody">        
            <tr v-for="(item, index) in value" class="table-item">
                <td>
                    <v-btn fab flat small v-if="editing"
                        class="table-row-handle">            
                        <v-icon dark>drag_handle</v-icon>
                    </v-btn>    
                </td>            
                <td>{{index}}</td>
                <td>
                    <dynamic :template="getTemplate()" :data="item"></dynamic>                
                    </td>
                <td>
                    <v-btn fab flat small class="delete-row-btn" @click="editItem(item, index)">
                        <v-icon dark>open_in_new</v-icon>
                    </v-btn>
                    
                    <v-btn fab flat small class="delete-row-btn" v-if="editing" @click="deleteItem(item, index)">
                        <v-icon dark>delete</v-icon>
                    </v-btn>
                </td>
            </tr>    
        </draggable>
    </table>
    <v-layout row justify-center>    
        <v-dialog v-model="dialog" scrollable persistent max-width="500px">
            <v-card>
                <v-card-title>Select Country</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 30em;">
                        <dyn-vue :property="editedProperty" v-model="editedValue" />
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                    <v-btn v-if="editing" color="primary" @click.native="okClicked">OK</v-btn>
                    <v-btn v-if="editing" color="green darken-1" flat="flat" @click.native="dialog = false">Cancel</v-btn>
                    <v-btn v-if="!editing" color="primary" @click.native="dialog = false">Close</v-btn>
                </v-card-actions>
      
            </v-card>
        </v-dialog>
    </v-layout>                
    <v-btn color="primary" v-if="editing" @click="addItem">Add</v-btn>
</div>`,
    beforeCreate: function (this: any) {
    },
    created: function (this: any) {
        console.log("table-vue", "created", "value", this.value);
    },
    beforeMount: function (this: any) {
        console.log("table-vue", "beforeMount");
        if (!this.value || !Array.isArray(this.value)) {
            this.$emit('input', [])
        }
        console.log("this.dynTemplate:", this.dynTemplate);
        var dynTemplateString = this.dynTemplate;
        this.dynTemplateComponent = Vue.component(
            'dyn-template',
            Vue.extend({
                props: ["value", "dynTemplate"],
                template: dynTemplateString,
                computed: {
                    content: function (this: any) {
                        console.log("ah", this.$parent);
                        return "ah\nah\n" + this.$parent;
                    }
                }
            }));
    },
    mounted: function (this: any) {
        console.log("table-vue", "mounted");
        if (!this.value || !Array.isArray(this.value)) {
            this.$emit('input', [])
        }
    },
    methods: {
        deleteItem: function (this: any, item: any, index: number) {
            this.value.splice(index, 1);
        },
        addItem: function (this: any, item: any, index: number) {
            this.editedPropertyIndex = -1;
            this.editedValue = {};
            this.editedProperty = {
                label: this.property.label,
                path: "",
                schema: this.property.schema.itemsSchema
            }
            this.dialog = true;
        },
        getValue: function (this: any, item: any, index: number) {
            console.log("table-vue", "getValue")
            return item;
        },
        getTemplate: function (this: any) {
            console.log("table-vue", "getTemplate")
            return this.property.schema.itemsTemplate;
        },

        editItem: function (this: TableVue, item: any, index: number) {
            this.editedPropertyIndex = index;
            this.editedValue = JSON.parse(JSON.stringify(this.value[index]));
            this.editedProperty = {
                label: this.property.label,
                path: "",
                schema: this.property.schema.itemsSchema
            }
            this.dialog = true;
        },
        okClicked: function (this: TableVue) {
            if (this.editedPropertyIndex == -1) {
                // we're adding a new row
                this.value.push({});
                this.editedPropertyIndex = this.value.length - 1;
            }
            Vue.set(this.value, this.editedPropertyIndex, this.editedValue);
            this.dialog = false;
        }
    },
    computed: {
        itemProperty: function (this: any) {
            return (property: Property<any, any>, item: any, index: number) => {
                return {
                    label: '#' + index,
                    schema: property.schema && (property.schema as TableSchema<any>).itemsSchema || {}
                };
            };
        }
    }
})
export class TableVue extends WikiVue<any, TableSchema<any>> {
    editedPropertyIndex = 0;
    editedValue: any = {};
    dialog = false;
    dynTemplateComponent: any = {};
    editedProperty: Property<any, any> = {
        path: "",
        label: "",
        schema: { kind: "string" }
    };
    static readonly htmlVueName = "table-vue";
    static readonly schemaKind = "table";
}

registerWikiVue(TableVue);

