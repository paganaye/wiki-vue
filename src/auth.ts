import * as Vue from 'vue';
import Vuetify from 'vuetify';

import * as firebase from 'firebase';
var auth = {
    userName: "unknown",
    loggedIn: false,
    login: "",
    password: "",
    error: ""
};

console.log("in auth");

Vue.component("auth-vue", {
    props: ["label", "value", "type"],
    template: `<div>
    <div v-if="loggedIn">    
        <p>{{userName}}</p>
        <v-btn @click="doLogout">Logout</v-btn>
        </div>    
    <div v-else>    
        <v-text-field
            label="user"
            v-model="login"></v-text-field>
        <v-text-field
            label="password"
            type="password"
            v-model="password"></v-text-field>
        <v-btn @click="doLogin">Login</v-btn>
        <v-btn @click="doRegister">Register</v-btn>
        <v-btn @click="doResetPassword">Reset password</v-btn>
    </div>
    <p>{{error}}</p>
</div>`,

    data: () => auth,
    methods: {
        doLogout: () => {
            firebase.auth().signOut();
        },
        doLogin: () => {
            auth.error = "";
            firebase.auth().signInWithEmailAndPassword(
                auth.login,
                auth.password
            ).catch((e) => {
                auth.error = e.message;
            });
        },
        doResetPassword: () => {
            auth.error = "";
            firebase.auth().sendPasswordResetEmail(
                auth.login
            ).then((m) => {
                auth.error="Email sent. Check your email inbox or possibly the spam folder."
            }).catch((e) => {
                auth.error = e.message;
            });
        },
        doRegister: () => {
            auth.error = "";
            firebase.auth().createUserWithEmailAndPassword(
                auth.login,
                auth.password
            ).catch((e) => {
                auth.error = e.message;
            });
        }        
    },
    created() {
        console.log("hi");
        
        try {
            var config = {
                apiKey: "AIzaSyCZEunQbNrQdbOhiF_3IhwY1F5gYTDpVaM",
                authDomain: "wiki-fab.firebaseapp.com",
                databaseURL: "https://wiki-fab.firebaseio.com",
                projectId: "wiki-fab",
                storageBucket: "wiki-fab.appspot.com",
                messagingSenderId: "708228282961"
            };
debugger;
            if (firebase.apps.length) {
                console.log("firebase is already initialized");
                location.reload(true);
            } else {
                firebase.initializeApp(config);
                firebase.auth().onAuthStateChanged((user) => {
                    auth.loggedIn = (user != null)
                    if (user == null) {
                        console.log("Logged out");
                    } else {
                        auth.userName = user.displayName || user.email;
                        console.log("User is now ", auth.userName);
                    }
                })
            }
        } catch (e) {
            console.error(e);
        }
    }
});


console.log("after auth");