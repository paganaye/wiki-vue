import * as Vue from 'vue';
import Vuetify from 'vuetify';
import * as firebase from 'firebase';
import Sortable = require('sortablejs');
import Component from "vue-class-component";

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
interface Property {
    path: string;
    label: string;
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

@Component({
    template: `<div>
    <button @click="onClick">Click!</button>
    <p>some text here</p>
    <p>and calculated one {{x}}</p>
</div>`,
    computed: {
        x: function (this: MyComponent) {
            return this.getX();
        }
    }
})
class MyComponent extends Vue {
    // Les données initiales peuvent être déclarées comme des propriétés de l'instance
    message: string = 'Bonjour !'
    // Les méthodes peuvent être déclarées comme des méthodes d'instance
    onClick(): void {
        window.alert(this.message);
        this.message = "Au revoir !"
    }

    getX(): string {
        console.log("calculating X");
        return this.message.toUpperCase();
    }

}


Vue.component("text-field-vue", {
    props: ["property", "value"],
    template: `<div>
    <v-text-field
        :label="property.label || (property.schema && (property.schema.label || property.schema.name)) || '???'"
        v-model="value" :type="inputType"></v-text-field>
</div>`,
    beforeUpdate: function (this: any) {
        console.log("text-field-vue", "beforeUpdate");
    },
    computed: {
        inputType: function (this: any) {
            var property = (this.property as Property);
            var kind = property.schema && property.schema.kind;
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
    props: ["property", "value"],
    template: `<div>
    <v-select
        :label="property.label || (property.schema && (property.schema.label || property.schema.name)) || '???'"
        v-model="value" :items="items"></v-select>
</div>`,
    beforeUpdate: function (this: any) {
        console.log("select-vue", "beforeUpdate");
    },
    computed: {
        items: function (this: any) {
            console.log("property", this.property, "value", this.value);
            return this.property.schema.list;
        }
    }
});

Vue.component("object-vue", {
    props: ["property", "value", "debug"],
    template: `<div>
    <p>{{property.label}}</p>
    <div v-for="prop in property.schema.properties">
        <dyn-vue 
            :property="memberProperty(prop, value)" v-bind="memberValue(prop, value)" />
    </div>
</div>`,
    beforeCreate: function (this: any) {
    },
    created: function (this: any) {
    },
    beforeUpdate: function (this: any) {
        console.log("object-vue", "beforeUpdate");
    },
    computed: {
        memberProperty: function (this: any) {
            return (prop: any, objectValue: any) => {
                if (objectValue == null) objectValue = {};
                var itemValue = objectValue[prop.name];
                if (itemValue == null) {
                    switch (prop.schema.kind) {
                        case "array":
                            itemValue = [];
                            break;
                        case "object":
                            itemValue = {};
                            break;
                    }
                    objectValue[prop.name] = itemValue;
                }
                return {
                    schema: prop.schema,
                    label: prop.label || prop.name,
                    value: itemValue
                }
            }
        },
        memberValue: function (this: any) {
            return (prop: any, objectValue: any) => {
                if (objectValue == null) objectValue = {};
                var itemValue = objectValue[prop.name];
                return itemValue;
            }
        }

    }
});

Vue.component("array-vue", {
    props: ["property", "value"],
    template: `<div>
    <div  id="list" ref="list">        
        <div v-for="(item, index) in value" class="array-item">
            <div class="array-item-handle">{{index}}</div>
            <div class="array-item-content">
                <dyn-vue :property="itemProperty(property, item,index)" v-bind:'value[index]' />
            </div>
            <v-btn color="secondary" v-if="editing" @click="deleteItem(item, index)">Delete</v-btn>
        </div>    
    </div>
    <v-btn color="primary" v-if="editing" @click="addItem">Add</v-btn>
</div>`,
    beforeCreate: function (this: any) {
    },
    created: function (this: any) {
    },
    beforeUpdate: function (this: any) {
        console.log("array-vue", "beforeUpdate");
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
        if (list) {
            Sortable.create(list, {});
        } else {
            console.error("Cannot find element list", this)
        }
    }
});

Vue.component("dyn-vue", {
    props: ["property", "value", "debug"],
    template: `<div>
    <div v-if="debug">
        <p>schema:{{property.schema}}</p>
        <p>label:{{property.label}}</p>
        <p>value:{{value}}</p>
        <p>vueType:{{vueType}}</p>
    </div>
    <component :is="vueType" 
        :property="property" v-bind="value"></component>
</div>`,
    beforeUpdate: function (this: any) {
        console.log("dyn-vue", "beforeUpdate");
    },
    computed: {
        getSchema: function (this: any) {
            var schema = this.property.schema;
            if (schema) return schema;

            if (Array.isArray(this.value)) schema = { kind: "array" };
            else if (typeof this.value === "object") schema = { kind: "object" };
            else schema = { kind: "string" };

            return schema;
        },
        vueType: function (this: any) {

            console.log("calculating dyn-vue::vueType");
            console.log("this.property", JSON.stringify(this.property));
            console.log("this.value", JSON.stringify(this.value));

            var property: Property = this.property;
            var schema = this.getSchema;
            var result = vues[schema.kind] || "text-field-vue";
            return result;

        }
    }
});

Vue.component("wiki-vue", {
    props: ["document"],
    template: `<div>
    <p>Loading table:'{{table}}'</p>
    <dyn-vue :property="property" v-bind="this.value" debug="true" />  
    <v-btn v-if="!editing" color="primary" @click="edit">Edit</v-btn>
    <v-btn v-if="editing" color="primary" @click="save">Save</v-btn>
    <v-btn v-if="editing" color="secondary" @click="cancel">Cancel</v-btn>
    <p>xx</p>
    <my-component />    
</div>`,
    components: {
        "my-component": MyComponent
    },
    data: () => {
        return {
            editing: false,
            isEditable: true,
            value: {},
            property: {
            }
        };
    },
    beforeUpdate: function (this: any) {
        console.log("wiki-vue", "beforeUpdate");
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
            var that = this;
            var property = this.$data.property;
            var db = firebase.database();
            var ref = db.ref().child(this.table || "home");
            if (this.id) ref = ref.child(this.id);

            console.log("db", db, "ref", ref);
            // Attach an asynchronous callback to read the data at our posts reference
            ref.on("value", function (snapshot) {
                var val = snapshot.val();
                Vue.set(that, "value", val);
                console.log("firebase value", JSON.stringify(that.value));

            }, function (errorObject: any) {
                console.log("The read failed: " + errorObject.code);
            });
        },
        loadSchemaFromDb: function (this: any) {
            var that = this;
            var property = that.property;
            var db = firebase.database();
            var ref = db.ref().child("schema");
            if (this.id) ref = ref.child(this.table);

            console.log("db", db, "ref", ref);
            // Attach an asynchronous callback to read the data at our posts reference
            ref.on("value", function (snapshot) {
                var val = snapshot.val();
                Vue.set(that.property, "schema", val)
                console.log("firebase schema", JSON.stringify(property.schema));
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
