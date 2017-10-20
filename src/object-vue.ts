import * as Vue from 'vue';
import Vuetify from 'vuetify';
import Sortable = require('sortablejs');

Vue.use(Vuetify);

Vue.component("value-vue", {
    props: ["label", "value", "type"],
    template: `<div>
    <v-text-field
        :label="label || (type && (type.label || type.name)) || '???'"
        v-model="value"></v-text-field>
</div>`
});

Vue.component("object-vue", {
    props: ["label", "value", "type"],
    template: `<div>
    <p>{{label}}</p>
    <div v-for="prop in type.properties">
        <dyn-vue :type='prop.type' :label='prop.label || prop.name' :value='value[prop.name]' />
    </div>
</div>`
});

Vue.component("array-vue", {
    props: ["label", "value", "type"],
    template: `<div>
    <p>{{label}}</p>
    <div  id="list" ref="list">
        <div v-for="(item, index) in value" class="array-item">
            <div class="array-item-handle">{{index}}</div>
            <div class="array-item-content">
                <dyn-vue :label="'#' + index" :type='type && type.innerType || {}' :value='item' />
            </div>
            <v-btn color="secondary">Delete</v-btn>
        </div>    
    </div>
    <v-btn color="primary">Add</v-btn>
</div>`,
    mounted: function () {
        var that = this as any;
        console.log("that", that);
        console.log("$refs", that.$refs);
        var list = that.$refs.list;
        Sortable.create(list, {});
    },


});

Vue.component("dyn-vue", {
    props: ["label", "value", "type"],
    template: `<div>
    <div v-if="debug">
        <p>type:{{type}}</p>
        <p>label:{{label}}</p>
        <p>value:{{value}}</p>
    </div>
    <component :is="componentType(value)" :label="label" :type="type" :value="value"></component>
</div>`,
    data: () => {
        return { debug: false };
    },
    computed: {
        componentType: () => {
            // I should not need a value here but this.value is messed up by typescript
            return (value: any) => {
                var result;
                if (Array.isArray(value)) result = "array-vue";
                else if (typeof value === "object") result = "object-vue";
                else result = "value-vue";
                console.log("dyn-vue", value, "=>", result);
                return result;
            };
        }
    }
});
