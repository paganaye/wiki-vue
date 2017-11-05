import Vue from 'vue';
eval("vue_1.default=vue_1;");


import Vuetify from 'vuetify';
import * as firebase from 'firebase';
import Component from "vue-class-component";
import { WikiVue, Property, vues, Schema, EditMode } from "./wiki-vue";
import { TextFieldVue } from './text-field-vue';
import { SelectVue } from './select-vue';
import { ObjectVue } from './object-vue';
import { ArrayVue } from './array-vue';
import { TableVue } from './table-vue';
import { DynVue } from './dyn-vue';
import { RomanVue } from './roman-vue';


console.log(TextFieldVue, SelectVue, ObjectVue, ArrayVue,
    DynVue, vues, RomanVue, TableVue);


class WikiPageSchema implements Schema<any> {
    kind: "page";
    defaultValue: any;
}

// WikiVue
@Component({
    template: `<div>
    <p v-if="loading">Loading {{table}} {{id}}</p>
    <dyn-vue v-if="!loading" :property="property" v-model="this.value" :debug="debug" />  
    <v-btn v-if="!loading && !editing" color="primary" @click="edit">Edit</v-btn>
    <v-btn v-if="editing" color="primary" @click="save">Save</v-btn>
    <v-btn v-if="editing" color="secondary" @click="cancel">Cancel</v-btn>
    <p>{{error}}</p>
    <pre v-if="debug">{{jsonvalue()}}</pre>
</div>`,
    props: ["document"],
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
    value: object = null;
    debug = false;

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
    loadSchemaFromDb(this: any) {
        var that = this;
        //var property = that.property;
        var db = firebase.database();
        var ref = db.ref().child("schema");
        if (this.id) ref = ref.child(this.table);

        console.log("db", db, "ref", ref);
        // Attach an asynchronous callback to read the data at our posts reference
        ref.on("value", function (snapshot) {
            var val = snapshot.val();
            that.schema = val;
            console.log("firebase schema", JSON.stringify(that.schema));
        }, function (errorObject: any) {
            console.log("The schema read failed: " + errorObject.code);
        });
    }
    jsonvalue(): string {
        return "VALUE: " + JSON.stringify(this.value);
    }
}

Vue.component("wiki-page", WikiPage);