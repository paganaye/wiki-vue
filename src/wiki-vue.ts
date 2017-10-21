import * as Vue from 'vue';
import Vuetify from 'vuetify';
import * as firebase from 'firebase';
import Sortable = require('sortablejs');


Vue.component("value-vue", {
    props: ["label", "value", "schema"],
    template: `<div>
    <v-text-field
        :label="label || (schema && (schema.label || schema.name)) || '???'"
        v-model="value"></v-text-field>
</div>`
});

Vue.component("object-vue", {
    props: ["label", "value", "schema"],
    template: `<div>
    <p>{{label}}</p>
    <div v-for="prop in schema.properties">
        <dyn-vue :schema='prop.schema' :label='prop.label || prop.name' :value='value[prop.name]' />
    </div>
</div>`
});

Vue.component("array-vue", {
    props: ["label", "value", "schema"],
    template: `<div>
    <p>{{label}}</p>
    <div  id="list" ref="list">
        <div v-for="(item, index) in value" class="array-item">
            <div class="array-item-handle">{{index}}</div>
            <div class="array-item-content">
                <dyn-vue :label="'#' + index" :schema='schema && schema.itemSchema || {}' :value='item' />
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
    props: ["label", "value", "schema"],
    template: `<div>
    <div v-if="debug">
        <p>schema:{{schema}}</p>
        <p>label:{{label}}</p>
        <p>value:{{value}}</p>
    </div>
    <component :is="componentSchema(value)" :label="label" :schema="schema" :value="value"></component>
</div>`,
    data: () => {
        return { debug: false };
    },
    computed: {
        componentSchema: () => {
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

Vue.component("wiki-vue", {
    props: ["document"],
    template: `<div>
    <p>Loading table:'{{table}}'</p>
    <p>Loading id: '{{id}}'</p>
    <p>document: '{{document}}'</p>
    <p>value:'{{value}}'</p>
    <p>value-vue</p>
    <dyn-vue label='xxx' :schema='schema' :value="value" />  
</div>`,
    data: () => {
        return {
            value: "loading...",
            schema: null
        };
    },
    methods: {
        loadValueFromDb: function (this: any) {
            var that = this;
            var db = firebase.database();
            var ref = db.ref().child(this.table || "home");
            if (this.id) ref = ref.child(this.id);
            that.value = "loading...";

            console.log("db", db, "ref", ref);
            // Attach an asynchronous callback to read the data at our posts reference
            ref.on("value", function (snapshot) {
                that.value = snapshot.val();
                console.log("snapshot", that.value);

            }, function (errorObject: any) {
                console.log("The read failed: " + errorObject.code);
            });
        },
        loadSchemaFromDb: function (this: any) {
            var that = this;
            var db = firebase.database();
            var ref = db.ref().child("schema");
            if (this.id) ref = ref.child(this.table);

            console.log("db", db, "ref", ref);
            // Attach an asynchronous callback to read the data at our posts reference
            ref.on("value", function (snapshot) {
                that.schema = snapshot.val();
                console.log("snapshot", that.schema);
            }, function (errorObject: any) {
                console.log("The schema read failed: " + errorObject.code);
            });
        }
    },
    watch: {
        document: function (this: any) {
            this.loadFromDb();
        }
    },
    computed: {
        table: function (this: any) {
            var pos = this.firstSpacePos;
            return pos < 0 ? this.document : this.document.substring(0, pos);
        },
        id: function (this: any) {
            var pos = this.firstSpacePos;
            // we remove spaces on each side and double space in between
            return pos < 0 ? "" : this.document.substring(pos + 1).trim().replace(/[ ]+/g, ' ');
        },
        firstSpacePos: function (this: any) {
            var pos = (this.document as String).indexOf(' ');
            return pos;
        }
    },
    created: function (this: any) {
        console.log("created", "this", this, "table", this.table, "id", this.id);
        // Import Admin SDK
        this.loadSchemaFromDb();
        this.loadValueFromDb();
        // Get a database reference to our posts
    }
});


