import * as Vue from 'vue';
import Vuetify from 'vuetify';
import * as firebase from 'firebase';
import Sortable = require('sortablejs');

interface Schema {
    kind: string;
}
interface ObjectSchema extends Schema {
    kind: "object";
    properties: ObjectProperty[];
}
interface ArraySchema extends Schema {
    kind: "array";
    itemsSchema: Schema;
}
interface ObjectProperty {
    label: string;
    name: string;
    schema: Schema;
}
interface TextSchema extends Schema {
    kind: "text";
}
interface SelectSchema extends Schema {
    kind: "select";
}
interface Vuepoint {
    label: string;
    value: any;
    schema: Schema;
}
Vue.component("value-vue", {
    props: ["vuepoint"],
    template: `<div>
    <v-text-field
        :label="vuepoint.label || (vuepoint.schema && (vuepoint.schema.label || vuepoint.schema.name)) || '???'"
        v-model="vuepoint.value"></v-text-field>
</div>`
});

Vue.component("object-vue", {
    props: ["vuepoint"],
    template: `<div>
    <p>{{vuepoint.label}}</p>
    <div v-for="prop in vuepoint.schema.properties">
        <dyn-vue 
            :vuepoint='propertyVuepoint(prop, vuepoint.value)' />
    </div>
</div>`,
    computed: {
        propertyVuepoint: () => {
            return (prop: any, value: any) => {
                return {
                    schema: prop.schema,
                    label: prop.label || prop.name,
                    value: value[prop.name]
                }
            }
        }
    }
});

Vue.component("array-vue", {
    props: ["vuepoint"],
    template: `<div>
    <p>{{label}}</p>
    <div  id="list" ref="list">
        <div v-for="(item, index) in vuepoint.value" class="array-item">
            <div class="array-item-handle">{{index}}</div>
            <div class="array-item-content">
                <dyn-vue :vuepoint="itemVuepoint(vuepoint, item,index)" />
            </div>
            <v-btn color="secondary">Delete</v-btn>
        </div>    
    </div>
    <v-btn color="primary">Add</v-btn>
</div>`,
    computed: {
        itemVuepoint: function (this: any) {
            return (vuepoint: Vuepoint, item: any, index: number) => {
                return {
                    label: '#' + index,
                    schema: vuepoint.schema && (vuepoint.schema as ArraySchema).itemsSchema || {},
                    value: item
                };
            };
        }
    },
    mounted: function (this: any) {
        console.log("this", this);
        console.log("$refs", this.$refs);
        var list = this.$refs.list;
        Sortable.create(list, {});
    }
});

Vue.component("dyn-vue", {
    props: ["vuepoint"],
    template: `<div>
    <div v-if="debug">
        <p>schema:{{vuepoint.schema}}</p>
        <p>label:{{vuepoint.label}}</p>
        <p>value:{{vuepoint.value}}</p>
    </div>
    <component :is="vueType(vuepoint)" 
        :vuepoint="vuepoint"></component>
</div>`,
    data: () => {
        return { debug: false };
    },
    computed: {
        getSchema: () => {
            return (vuePoint: Vuepoint) => {
                var schema = vuePoint.schema;
                if (schema) return schema;

                var value = vuePoint.value;
                if (Array.isArray(value)) schema = { kind: "array" };
                else if (typeof value === "object") schema = { kind: "object" };
                else schema = { kind: "value" };

                return schema;
            };
        },
        vueType: function(this:any) {
            // I should not need a value here but this.value is messed up by typescript
            return (vuePoint: Vuepoint) => {
                var schema = this.getSchema(vuePoint);
                switch (schema.kind) {
                    case "array":
                    case "object":
                    case "value":
                        return schema.kind + "-vue";
                    default:
                        return "value-vue";
                }
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
    <dyn-vue :vuepoint="vuepoint" />  
</div>`,
    data: () => {
        return {
            vuepoint: {
                value: "loading"
            }
        };
    },
    methods: {
        loadValueFromDb: function (this: any) {
            var vuepoint = this.$data.vuepoint;
            var db = firebase.database();
            var ref = db.ref().child(this.table || "home");
            if (this.id) ref = ref.child(this.id);
            vuepoint.value = "loading...";

            console.log("db", db, "ref", ref);
            // Attach an asynchronous callback to read the data at our posts reference
            ref.on("value", function (snapshot) {
                vuepoint.value = snapshot.val();
                console.log("snapshot", vuepoint.value);

            }, function (errorObject: any) {
                console.log("The read failed: " + errorObject.code);
            });
        },
        loadSchemaFromDb: function (this: any) {
            var vuepoint = this.$data.vuepoint;
            var db = firebase.database();
            var ref = db.ref().child("schema");
            if (this.id) ref = ref.child(this.table);

            console.log("db", db, "ref", ref);
            // Attach an asynchronous callback to read the data at our posts reference
            ref.on("value", function (snapshot) {
                vuepoint.schema = snapshot.val();
                console.log("snapshot", vuepoint.schema);
            }, function (errorObject: any) {
                console.log("The schema read failed: " + errorObject.code);
            });
        }
    },
    watch: {
        document: function (this: any) {
            this.loadFromDb();
            this.loadSchemaFromDb();
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
    mounted: function (this: any) {
        console.log("created", "this", this, "table", this.table, "id", this.id);
        // Import Admin SDK
        this.loadSchemaFromDb();
        this.loadValueFromDb();
        // Get a database reference to our posts
    }
});


