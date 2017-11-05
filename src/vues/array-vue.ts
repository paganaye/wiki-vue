import Vue1 = require('vue');
(Vue1.default as any) = Vue1;
var Vue = Vue1.default;
import Component from "vue-class-component";
import { WikiVue, Property, isEditing, Schema, vues } from "./wiki-vue";


declare function require(name: string): any;
var draggable = require('vuedraggable');
Vue.component("draggable", draggable.default);

interface ArraySchema extends Schema {
    kind: "array";
    itemsSchema: Schema;
}

// ArrayVue
@Component({
    props: ["property", "value"],
    components: {
        draggable
    },
    template: `<div>
    <draggable :list="value" id="list" ref="list" :options='{handle:".array-item-handle"}'>        
        <div v-for="(item, index) in value" class="array-item">
            <div v-if="editing" class="array-item-handle" :title="index"></div>
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
    beforeUpdate: function (this: any) {
        console.log("array-vue", "beforeUpdate");
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
        }
    },
    computed: {
        editing: function (this: any) {
            return isEditing(this);
        },
        itemProperty: function (this: any) {
            return (property: Property, item: any, index: number) => {
                return {
                    label: '#' + index,
                    schema: property.schema && (property.schema as ArraySchema).itemsSchema || {}
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
export class ArrayVue extends WikiVue {

}

Vue.component("array-vue", ArrayVue);
vues.array = 'array-vue';

