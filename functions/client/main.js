import Vue from "vue";
import App from "./Components/App.vue";
import VueApollo from "vue-apollo";
import ApolloClient from "apollo-boost";

const apolloClient = new ApolloClient({
  uri: "graphql",
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({ defaultClient: apolloClient });

Vue.config.productionTip = false;

new Vue({ render: (h) => h(App), apolloProvider }).$mount("#app");
