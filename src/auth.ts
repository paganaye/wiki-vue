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

function initAuth() {
    try {
        var config = {
            apiKey: "AIzaSyCZEunQbNrQdbOhiF_3IhwY1F5gYTDpVaM",
            authDomain: "wiki-fab.firebaseapp.com",
            databaseURL: "https://wiki-fab.firebaseio.com",
            projectId: "wiki-fab",
            storageBucket: "wiki-fab.appspot.com",
            messagingSenderId: "708228282961"
        };

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

function logout() {
    firebase.auth().signOut();
}

function login() {
    auth.error = "";
    firebase.auth().signInWithEmailAndPassword(
        auth.login,
        auth.password
    ).catch((e) => {
        auth.error = e.message;
    });
}

function resetPassword() {
    auth.error = "";
    firebase.auth().sendPasswordResetEmail(
        auth.login
    ).then((m) => {
        auth.error = "Email sent. Check your email inbox or possibly the spam folder."
    }).catch((e) => {
        auth.error = e.message;
    });
}

function register() {
    auth.error = "";
    firebase.auth().createUserWithEmailAndPassword(
        auth.login,
        auth.password
    ).catch((e) => {
        auth.error = e.message;
    });
}

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
            logout();
        },
        doLogin: () => {
            login();
        },
        doResetPassword: () => {
            resetPassword();
        },
        doRegister: () => {
            register();
        }
    },
    created() {
        initAuth();
    }
});

// https://material.io/icons/


Vue.component("auth-toolbar-vue", {
    props: ["label", "value", "type"],
    template: `

<v-menu bottom left>
    <v-btn icon slot="activator">
        <v-icon>account_circle</v-icon>        
    </v-btn>
    <v-list>
        <v-list-tile key="title1" @click="">
            <v-list-tile-title>Some text here</v-list-tile-title>
        </v-list-tile>
        <v-list-tile key="title2" @click="">
            <v-list-tile-title>Some text here</v-list-tile-title>
        </v-list-tile>
    </v-list>
</v-menu>
 
<!--    <div v-if="loggedIn">    
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
    -->
`,

    data: () => auth,
    methods: {
        doLogout: () => {
            logout();
        },
        doLogin: () => {
            login();
        },
        doResetPassword: () => {
            resetPassword();
        },
        doRegister: () => {
            register();
        }
    },
    created() {
        initAuth();
    }
});


