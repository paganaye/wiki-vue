import Vue1 = require('vue');
(Vue1.default as any) = Vue1;
var Vue = Vue1.default;

import Vuetify from 'vuetify';
import * as firebase from 'firebase';
import Component from "vue-class-component";
import { WikiVue, Property, vues } from "./wiki-vue";
import { TextFieldVue } from './text-field-vue';
import { SelectVue } from './select-vue';
import { ObjectVue } from './object-vue';
import { ArrayVue } from './array-vue';
import { DynVue } from './dyn-vue';


console.log(TextFieldVue, SelectVue, ObjectVue, ArrayVue, DynVue, vues);


function isEditing(component: any): boolean {
    while (component) {
        if ((component as any).isEditable) return (component as any).editing;
        component = component.$parent;
    }
    return false;
}

// WikiVue
@Component({
    template: `<div>
    <p>Loading table:'{{table}}'</p>
    <dyn-vue :property="property" v-model="this.value" debug="true" />  
    <v-btn v-if="!editing" color="primary" @click="edit">Edit</v-btn>
    <v-btn v-if="editing" color="primary" @click="save">Save</v-btn>
    <v-btn v-if="editing" color="secondary" @click="cancel">Cancel</v-btn>
    <pre>{{jsonvalue()}}</pre>
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
        }
    },
    beforeUpdate: function (this: any) {
        console.log("wiki-vue", "beforeUpdate");
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
    }
})
class WikiPage extends WikiVue {
    editing = false;
    isEditable = true;
    value = {};
    property = {};

    edit(this: any) {
        this.editing = true
    }
    save(this: any) {
        this.editing = false
    }
    cancel(this: any) {
        this.editing = false
    }
    loadValueFromDb(this: any) {
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
    }
    loadSchemaFromDb(this: any) {
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
    jsonvalue(): string {
        return "VALUE: " + JSON.stringify(this.value);
    }
}

Vue.component("wiki-page", WikiPage);