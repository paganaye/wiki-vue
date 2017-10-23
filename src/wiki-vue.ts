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

function isEditing(component: Vue): boolean {
    while (component) {
        if ((component as any).isEditable) return (component as any).editing;
        component = component.$parent;
    }
    return false;
}

var vues: { [key: string]: string } = {
    'object': 'object-vue',
    'array': 'array-vue',
    'string': 'text-field-vue',
    'number': 'text-field-vue',
    'select': 'select-vue'
};

Vue.component("text-field-vue", {
    props: ["vuepoint"],
    template: `<div>
    <v-text-field
        :label="vuepoint.label || (vuepoint.schema && (vuepoint.schema.label || vuepoint.schema.name)) || '???'"
        v-model="vuepoint.value" :type="inputType"></v-text-field>
</div>`,
    computed: {
        inputType: function (this: any) {
            var vuepoint = (this.vuepoint as Vuepoint);
            var kind = vuepoint.schema && vuepoint.schema.kind;
            switch (kind) {
                case 'number':
                case 'color':
                case 'date':
                case 'datetime-local':
                case 'email':
                case 'month':
                case 'number':
                case 'range':
                case 'search':
                case 'tel':
                case 'time':
                case 'url':
                case 'week':
                    console.log("input-type", kind)
                    return kind;
                default:
                    return 'text'
            }
        }
    }
});

Vue.component("select-vue", {
    props: ["vuepoint"],
    template: `<div>
    <v-select
        :label="vuepoint.label || (vuepoint.schema && (vuepoint.schema.label || vuepoint.schema.name)) || '???'"
        v-model="vuepoint.value" :items="items"></v-select>
</div>`,
    computed: {
        items: function (this: any) {
            console.log("vuepoint", this.vuepoint);
            return this.vuepoint.schema.list;
        }
    }
});

Vue.component("object-vue", {
    props: ["vuepoint", "debug"],
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
                if (value == null) value = {};
                if (value[prop.name] == null) value[prop.name] = {};
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
    props: ["vuepoint", "page"],
    template: `<div>
    <div  id="list" ref="list">
        <div v-for="(item, index) in vuepoint.value" class="array-item">
            <div class="array-item-handle">{{index}}</div>
            <div class="array-item-content">
                <dyn-vue :vuepoint="itemVuepoint(vuepoint, item,index)" />
            </div>
            <v-btn color="secondary" v-if="editing" @click="deleteItem(item, index)">Delete</v-btn>
        </div>    
    </div>
    <v-btn color="primary" v-if="editing" @click="addItem">Add</v-btn>
</div>`,
    methods: {
        deleteItem: function (this: any, item: any, index: number) {
            var vuepoint: Vuepoint = this.vuepoint;
            vuepoint.value.splice(index, 1);
        },
        addItem: function (this: any, item: any, index: number) {
            var vuepoint: Vuepoint = this.vuepoint;
            if (!Array.isArray(vuepoint.value)) vuepoint.value = [];
            vuepoint.value.push({});
        }
    },
    computed: {
        editing: function (this: any) {
            return isEditing(this);
        },
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
        if (list) {
            Sortable.create(list, {});
        } else {
            console.error("Cannot find element list", this)
        }
    }
});

Vue.component("dyn-vue", {
    props: ["vuepoint", "debug"],
    template: `<div>
    <div v-if="debug">
        <p>schema:{{vuepoint.schema}}</p>
        <p>label:{{vuepoint.label}}</p>
        <p>value:{{vuepoint.value}}</p>
    </div>
    <component :is="vueType(vuepoint)" 
        :vuepoint="vuepoint"></component>
</div>`,
    computed: {
        getSchema: () => {
            return (vuepoint: Vuepoint) => {
                var schema = vuepoint.schema;
                if (schema) return schema;

                var value = vuepoint.value;
                if (Array.isArray(value)) schema = { kind: "array" };
                else if (typeof value === "object") schema = { kind: "object" };
                else schema = { kind: "string" };

                return schema;
            };
        },
        vueType: function (this: any) {
            // I should not need a value here but this.value is messed up by typescript
            return (vuepoint: Vuepoint) => {
                var schema = this.getSchema(vuepoint);
                var result = vues[schema.kind] || "text-field-vue";
                return result;
            };
        }
    }
});

Vue.component("wiki-vue", {
    props: ["document"],
    template: `<div>
    <p>Loading table:'{{table}}'</p>
    <dyn-vue :vuepoint="vuepoint" />  
    <v-btn v-if="!editing" color="primary" @click="edit">Edit</v-btn>
    <v-btn v-if="editing" color="primary" @click="save">Save</v-btn>
    <v-btn v-if="editing" color="secondary" @click="cancel">Cancel</v-btn>
</div>`,
    data: () => {
        return {
            editing: false,
            isEditable: true,
            vuepoint: {
                value: "loading"
            }
        };
    },
    methods: {
        edit: function (this: any) {
            this.editing = true
        },
        save: function (this: any) {
            this.editing = false
        },
        cancel: function (this: any) {
            this.editing = false
        },
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
            this.loadValueFromDb();
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


