#!/usr/bin/node
const { FuseBox } = require("fuse-box");
const fuse = FuseBox.init({
    homeDir: "src",
    output: "dist/$name.js",
    alias: {
        vue: "vue/dist/vue.js",
        firebase: "firebase/index.js"
    }
});
fuse.bundle("libs")
    .target("browser")
    .instructions(`~ index.ts`);

fuse.bundle("app")
    .target("browser")
    .watch("**")
    .hmr()
    .instructions(`!> [index.ts]`);
//    .instructions(`!> [index.value-object.ts]`);
    
fuse.dev({});
fuse.run();