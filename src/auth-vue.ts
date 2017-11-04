import Vue1 = require('vue'); 
(Vue1.default as any) = Vue1; 
var Vue = Vue1.default;
import Vuetify from 'vuetify';

import * as firebase from 'firebase';
var userInstance: any = null;

var authInstance = {
    loggedIn: false,
    login: "",
    password: "",
    userName: "unknown",
    error: "",
    loginDialog: false,
    registerDialog: false
};

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
                authInstance.loggedIn = (user != null)
                if (authInstance.loggedIn) {
                    authInstance.userName = user.displayName || user.email;
                    console.log("User is now ", authInstance.userName);
                    authInstance.loginDialog = false;
                    authInstance.registerDialog = false;
                } else {
                    console.log("Logged out");
                }
            });
        }
    } catch (e) {
        console.error(e);
    }
}

function logout() {
    firebase.auth().signOut();
}

function login() {
    authInstance.error = "";
    firebase.auth().signInWithEmailAndPassword(
        authInstance.login,
        authInstance.password
    ).catch((e) => {
        authInstance.error = e.message;
    });
}

function resetPassword() {
    authInstance.error = "";
    firebase.auth().sendPasswordResetEmail(
        authInstance.login
    ).then((m) => {
        authInstance.error = "Email sent. Check your email inbox or possibly the spam folder."
    }).catch((e) => {
        authInstance.error = e.message;
    });
}

function register() {
    authInstance.error = "";
    firebase.auth().createUserWithEmailAndPassword(
        authInstance.login,
        authInstance.password
    ).catch((e) => {
        authInstance.error = e.message;
    });
}


// https://material.io/icons/


Vue.component("auth-vue", {
    props: ["label", "value", "type"],
    template: `
<v-menu bottom left>
    <v-btn icon slot="activator">
        <v-icon>account_circle</v-icon>        
    </v-btn>
    <v-list>
        <v-list-tile key="title1" @click="auth.loginDialog = true" v-if="!auth.loggedIn">
            <v-list-tile-title>Login</v-list-tile-title>
        </v-list-tile>
        <v-list-tile key="title2" @click="auth.registerDialog = true" v-if="!auth.loggedIn">
            <v-list-tile-title>Register</v-list-tile-title>
        </v-list-tile>
        <v-list-tile key="title3" @click="gotoAccount" v-if="auth.loggedIn">
            <v-list-tile-title>{{auth.userName}}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile key="title3" @click="doLogout" v-if="auth.loggedIn">
            <v-list-tile-title>Logout</v-list-tile-title>
        </v-list-tile>
    </v-list> 
    <v-dialog v-model="auth.loginDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Login</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field label="Email" v-model="auth.login"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field label="Password" type="password" v-model="auth.password"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <p>{{auth.error}}</p>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click="doLogin">Login</v-btn>
                <v-btn color="primary" flat @click="auth.loginDialog = false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="auth.registerDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Register</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12 sm6 md4>
                            <v-text-field label="Legal first name" required></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md4>
                            <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md4>
                            <v-text-field label="Legal last name" hint="example of helper text"
                                persistent-hint
                                required></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field label="Email" required></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field label="Password" type="password" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                            <v-select
                            label="Age"
                            required
                            :items="['0-17', '18-29', '30-54', '54+']"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6>
                            <v-select
                                label="Interests"
                                multiple
                                autocomplete
                                chips
                                :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                                ></v-select>
                        </v-flex>
                    </v-layout>
                </v-container>
                <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click="registerDialog = false">Register</v-btn>
                <v-btn color="primary" flat @click="registerDialog = false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="auth.resetPasswordDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Reset password</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field label="Email" required></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click="resetPasswordDialog = false">Send password recovery email</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>    
</v-menu>`,
    data: () => {
        return {
            auth: authInstance
        };
    },
    methods: {
        doLogin: () => {
            login();
        },
        doLogout: () => {
            logout();
        },
        gotoAccount: () => {
            location.hash = "account"
        }
    },
    created() {
        initAuth();
    }
});


