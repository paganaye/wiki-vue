#!/usr/bin/node
const { FuseBox } = require("fuse-box");
const fuse = FuseBox.init({
    homeDir: "src",
    output: "dist/$name.js",
    alias: {
        vue: "vue/dist/vue.js"
    }
});

fuse.bundle("app")
    .watch("**")
    .hmr()
    .instructions(`>index.ts`);

fuse.dev({});
fuse.run();