import Vue from 'vue';
eval("vue_1.default=vue_1;");
import Component from "vue-class-component";
import { WikiVue, Property, Schema, vues } from "./wiki-vue";

declare function require(name: string): any;
var draggable = require('vuedraggable');
Vue.component("draggable", draggable.default);

interface TableSchema<TItemType> extends Schema<TItemType[]> {
    kind: "table";
    itemsSchema: Schema<TItemType>;
}

// TableVue
@Component({
    props: ["property", "value"],
    components: {
        draggable
    },
    template: `<div>
    <table>
        <thead>
            <tr>
                <th>&nbsp;</th>
                <th>#</th>
                <th>Description</th>
                <th>&nbsp;</th>
            </tr>        
        </thead>
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
                <td>{{item}}</td>
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
        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">User Profile</span>
                </v-card-title>
                <v-card-text>
                    <p>{{editing}}</p>
                    <small>*indicates required field</small>
                    <dyn-vue :property="editedProperty" v-model="editedValue" />
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
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
    beforeUpdate: function (this: any) {
        console.log("table-vue", "beforeUpdate");
        if (this.value == null) {
            this.$emit('input', [])
        }
    },
    methods: {
        deleteItem: function (this: any, item: any, index: number) {
            this.value.splice(index, 1);
        },
        addItem: function (this: any, item: any, index: number) {
            this.value.push({});
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
            Vue.set(this.value, this.editedPropertyIndex, this.editedValue);
            //this.$emit("input", this.value);
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
    },
    mounted: function (this: any) {
        console.log("this", this);
        console.log("$refs", this.$refs);
        var list = this.$refs.list;
        if (!list) {
            console.error("Cannot find element list", this)
        }
    }
})
export class TableVue extends WikiVue<any, TableSchema<any>> {
    editedPropertyIndex = 0;
    editedValue: any = {};
    dialog = false;
    editedProperty: Property<any, any> = {
        path: "",
        label: "",
        schema: { kind: "string" }
    };
}

Vue.component("table-vue", TableVue);
vues.table = 'table-vue';

