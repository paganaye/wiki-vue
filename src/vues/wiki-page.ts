import Vue from 'vue';
eval("vue_1.default=vue_1;");


import Vuetify from 'vuetify';
import * as firebase from 'firebase';
import Component from "vue-class-component";
import { WikiVue, Property, vues, Schema, EditMode } from "./wiki-vue";
import { TextFieldVue, StringSchema, NumberSchema } from './text-field-vue';
import { SelectVue, SelectSchema } from './select-vue';
import { ObjectVue, ObjectSchema, ObjectMember } from './object-vue';
import { ArrayVue, ArraySchema } from './array-vue';
import { TableVue, TableSchema } from './table-vue';
import { DynVue } from './dyn-vue';
import { SwitchVue, SwitchSchema } from './switch-vue';
import { RomanVue } from './roman-vue';


console.log(TextFieldVue, SelectVue, ObjectVue, ArrayVue,
    DynVue, vues, RomanVue, TableVue, SwitchVue);


class WikiPageSchema implements Schema<any> {
    kind: "page";
}

// WikiVue
@Component({
    template: `<div class="flex xs12 sm10 md8 lg6">
    <p v-if="loading">Loading {{table}} {{id}}</p>
    <dyn-vue v-if="!loading" :property="property" v-model="pageValue" :debug="debug" />  
    <v-btn v-if="!loading && !editing" color="primary" @click="edit">Edit</v-btn>
    <v-btn v-if="editing" color="primary" @click="save">Save</v-btn>
    <v-btn v-if="editing" color="secondary" @click="cancel">Cancel</v-btn>
    <p>{{error}}</p>
    <pre v-if="debug">{{jsonvalue()}}</pre>
</div>`,
    props: ["document"],
    computed: {
        pageValue: {
            get: function (this: any) {
                return this.value;
            },
            set: function (this: any, val: any) {
                this.value = val;
                console.log("page value", val);
            }
        },
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
        },
        loading: function (this: any) {
            console.log("calculating loading", this.value == null, this.schema == null, this.value, this.schema)
            return this.value == null || this.schema == null;
        },
        property: function (this: any): Property<any, any> {
            return {
                label: this.table + " " + this.id,
                path: "",
                schema: this.schema
            }
        }
    },
    watch: {
        document: function (this: any) {
            this.loadValueFromDb();
            this.loadSchemaFromDb();
        }
    },
    mounted: function (this: any) {
        console.log("created", "this", this, "table", this.table, "id", this.id);
        // Import Admin SDK
        this.loadSchemaFromDb();
        this.loadValueFromDb();
        // Get a database reference to our posts
    },

})

class WikiPage extends WikiVue<any, WikiPageSchema> {
    error = "";
    debug = false;
    value: object = null;
    schema: Schema<any> = { kind: "object" };
    // computed
    table: string;
    id: string;

    static schemaKindMetaSchema: SwitchSchema = {
        kind: "switch",
        kinds: []
    } as SwitchSchema;

    static schemaMetaSchema = WikiPage.schemaKindMetaSchema;

    // static schemaMetaSchema: ObjectSchema = {
    //      kind: "object",
    //      members: [{
    //          name: "kind",
    //          schema: WikiPage.schemaKindMetaSchema
    //      }]
    // };

    static memberMetaSchema: ObjectSchema = {
        kind: "object",
        members: [
            {
                name: "name",
                schema: {
                    kind: "string"
                } as StringSchema
            },
            {
                name: "label",
                schema: {
                    kind: "string"
                } as StringSchema
            },
            {
                name: "schema",
                schema: WikiPage.schemaMetaSchema
            }]
    };

    static initialize() {
        var kinds = WikiPage.schemaKindMetaSchema.kinds;

        kinds.push({
            kind: "string", members: [
                { name: "maxLength", schema: { kind: "number" } }]
        });
        kinds.push({
            kind: "number", members: [
                { name: "minValue", schema: { kind: "number" } },
                { name: "maxValue", schema: { kind: "number" } }]
        });
        kinds.push({
            kind: "email", members: []
        });
        kinds.push({
            kind: "object", members: [
                {
                    name: "members", schema: {
                        kind: "table",
                        itemsSchema: WikiPage.memberMetaSchema,
                        itemsTemplate: "<span>{{name}}</span>"
                    } as TableSchema<any>
                }
            ]
        });
        kinds.push({
            kind: "array", members: [
                { name: "itemsSchema", schema: WikiPage.schemaMetaSchema }]
        });
        kinds.push({
            kind: "select", members: [
                {
                    name: "items", schema: {
                        kind: "array", itemsSchema: {
                            kind: "object",
                            members: [
                                { name: "value", schema: { kind: "string" } },
                                { name: "text", schema: { kind: "string" } }]
                        }
                    } as ArraySchema<any>
                }
            ]
        });
        kinds.push({
            kind: "switch", members: [
                {
                    //    kinds: { kind: string, members: ObjectMember[] }[]
                    name: "kinds", schema: {
                        kind: "array", itemsSchema: {
                            kind: "object",
                            members: [
                                { name: "kind", schema: { kind: "string" } },
                                {
                                    name: "members", schema: {
                                        kind: "table",
                                        itemsSchema: WikiPage.memberMetaSchema,
                                        itemsTemplate: "<p>hi2 {{this.toString()}}</p>"
                                    } as TableSchema<any>
                                }]
                        }
                    } as ArraySchema<any>
                }
            ]
        });

    }


    edit(this: WikiPage) {
        this.error = "";
        this.editMode = EditMode.Editing;
    }
    save(this: any) {
        this.error = "";
        var db = firebase.database();
        var ref = db.ref().child(this.table || "home");
        if (this.id) ref = ref.child(this.id);

        ref.set(this.value).then(() => {
            this.editMode = EditMode.Viewing;
        }).catch(e => {
            this.error = e.toString();
        });

    }
    cancel(this: WikiPage) {
        this.editMode = EditMode.Viewing;
        this.error = "";
    }
    loadValueFromDb(this: any) {
        var that = this;
        //var property = this.$data.property;
        var db = firebase.database();
        var ref = db.ref().child(this.table || "home");
        if (this.id) ref = ref.child(this.id);

        console.log("db", db, "ref", ref);
        // Attach an asynchronous callback to read the data at our posts reference
        ref.on("value", function (snapshot) {
            var val = snapshot.val();
            if (val === null) val = {};
            that.value = val;
            console.log("firebase value", JSON.stringify(that.value));
        }, function (errorObject: any) {
            console.log("The read failed: " + errorObject.code);
        });
    }
    loadSchemaFromDb(this: WikiPage) {
        var that = this;
        switch (this.table) {
            case "schema":
                that.schema = WikiPage.schemaMetaSchema;
                break;
            default:
                //var property = that.property;
                var db = firebase.database();
                var ref = db.ref().child("schema");
                if (this.id) ref = ref.child(this.table);

                console.log("db", db, "ref", ref);
                // Attach an asynchronous callback to read the data at our posts reference
                ref.on("value", function (snapshot) {
                    var val = snapshot.val();
                    if (val == null) {
                        val = {};
                    }
                    that.schema = val;
                    console.log("firebase schema", JSON.stringify(that.schema));
                }, function (errorObject: any) {
                    console.log("The schema read failed: " + errorObject.code);
                });
        }
    }
    jsonvalue(): string {
        return "VALUE: " + JSON.stringify(this.value);
    }
}

WikiPage.initialize();

Vue.component("wiki-page", WikiPage);

