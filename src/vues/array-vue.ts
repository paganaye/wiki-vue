import Vue from 'vue';
eval("vue_1.default=vue_1;");
import Component from "vue-class-component";
import { WikiVue, Property, Schema, vues } from "./wiki-vue";


declare function require(name: string): any;
var draggable = require('vuedraggable');
Vue.component("draggable", draggable.default);

export interface ArraySchema<TItemType> extends Schema<TItemType[]> {
    kind: "array";
    itemsSchema: Schema<TItemType>;
}

// ArrayVue
@Component({
    props: ["property", "value"],
    components: {
        draggable
    },
    template: `<div>
    <draggable :list="value" id="list" ref="list" 
        :options='{handle:".array-item-handle", onStart:"onStart", onEnd:"onEnd"}'>        
        <div v-for="(item, index) in value" class="array-item">
            <v-btn fab flat small v-if="editing"
                class="array-item-handle" :title="index">            
                <v-icon dark>drag_handle</v-icon>
            </v-btn>    
            <div class="array-item-content">
                <dyn-vue :property="itemProperty(property, item,index)" v-model="value[index]" />
            </div>
            <v-btn fab flat small class="delete-array-item-btn" v-if="editing" @click="deleteItem(item, index)">
                <v-icon dark>delete</v-icon>
            </v-btn>
        </div>    
    </draggable>
    <v-btn color="primary" v-if="editing" @click="addItem">Add</v-btn>
</div>`,
    beforeCreate: function (this: any) {
    },
    created: function (this: any) {
        console.log("array-vue", "created", "value", this.value);
    },
    beforeMount: function (this: any) {
        console.log("array-vue", "beforeMount");
        if (!this.value || !Array.isArray(this.value)) {
            this.$emit('input', [])
        }
    },
    methods: {
        deleteItem: function (this: any, item: any, index: number) {
            this.value.splice(index, 1);
        },
        addItem: function (this: any, item: any, index: number) {
            this.value.push({});
        }
    },
    computed: {
        itemProperty: function (this: any) {
            return (property: Property<any, any>, item: any, index: number) => {
                return {
                    label: '#' + index,
                    schema: property.schema && (property.schema as ArraySchema<any>).itemsSchema || {}
                };
            };
        }
    },
    mounted: function (this: any) {
        console.log("array-vue", "mounted");
        console.log("this", this);
        console.log("$refs", this.$refs);
        var list = this.$refs.list;
        if (!list) {
            console.error("Cannot find element list", this)
        }
    }
})
export class ArrayVue extends WikiVue<any, ArraySchema<any>> {

}

Vue.component("array-vue", ArrayVue);
vues.array = 'array-vue';

