import * as Vue from 'vue';
import Vuetify from 'vuetify';
import * as fireBase from 'firebase';


import * as firebase from 'firebase';

Vue.component("wiki-vue", {
    props: ["document"],
    template: `<div>
    <p>Loading table:'{{table}}'</p>
    <p>Loading id: '{{id}}'</p>
    <p>document: '{{document}}'</p>
    <p>value:'{{value}}'</p>
</div>`,
    data: () => {
        return {
            value: ""
        };
    },
    methods: {
        loadFromDb: function (this: any) {
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
        this.loadFromDb()
        // Get a database reference to our posts
    }
});


