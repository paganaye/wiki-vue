// import Vue from 'vue';
// eval("vue_1.default=vue_1;");
// import Component from "vue-class-component";
// import { WikiVue, Property, Schema, vues } from "./wiki-vue";


// // export interface TableSchema<TItemType> extends Schema<TItemType[]> {
// //     kind: "table";
// //     itemsSchema: Schema<TItemType>;
// //     itemsTemplate: string;
// // }

// // TableVue
// @Component({
//     props: ["dynTemplate", "value"],
//     components: {
//     },
//     methods: {
//     },
//     computed: {
//     },
//     beforeMount: function (this: any) {
//         console.log("dyn-template", "beforeMount");
//         this.template = Vue.compile('<div>hi ' + this.dynTemplate + '!</div>').render;
//     },
//     beforeUpdate: function (this: any) {
//         console.log("dyn-template", "beforeUpdate");
//         this.template = Vue.compile('<div>hi ' + this.dynTemplate + '!</div>').render;
//     },
//     render: function (this: any, createElement) {
//         //var res = Vue.compile('<div><span>{{ msg }}</span></div>')
//         new Vue({
//           data: {
//             msg: 'hello'
//           },
// //          render: res.render,
// //          staticRenderFns: res.staticRenderFns
//         })


//         if (!this.dynTemplate) {
//             return createElement('div', 'Loading...');
//         } else {
//             return this.template();
//         }
//     }
// })
// export class DynTemplate extends Vue {
//     template: () => {};
// }

// Vue.component("dyn-template", DynTemplate);


