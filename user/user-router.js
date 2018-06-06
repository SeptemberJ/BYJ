Vue.config.devtools = true;



const routes = [
    { path: '/', component: app.index },
    {path:'/apply', component: app.apply},
    {path:'/upload', component: app.upload},
    {path:'/success', component:app.success}
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

// var App = Vue.extend({});
new Vue({
    router
}).$mount('#app')
// router.start(App, '#app');

