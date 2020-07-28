import {SubscriptionClient} from "subscriptions-transport-ws";
import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import {WebSocketLink} from "apollo-link-ws";
import {InMemoryCache} from "apollo-cache-inmemory";
import {init as tokenInit} from "../logic/stage/layers/token/init";
import {init as backgroundInit} from "../logic/stage/layers/background/init";

const GRAPHQL_ENDPOINT = "ws://" + process.env.BACKEND + "/graphql";

const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true,
});

const cache = new InMemoryCache();
const link = new WebSocketLink(client);

let store = {};

const apolloClient = new ApolloClient({
  cache,
  link
});

const allCharacters = gql`
  {
    allCharacters{pos{point{x y} rot size} name token players {id} id}
  }
`

const getBackgroundLayer = gql`
  {
    getBackgroundLayer {layer}
  }
`

const mutationCharacterPosition = gql`
  mutation setCharacterPosition($id:String!, $x:Int!, $y:Int!){
    updateCharacterPosition(id:$id, x:$x, y:$y) {pos{point{x y} rot size} name token players {id} id}
  }
`

const updateCharacterSubscription = gql`
  subscription {
    updateCharacter {pos{point{x y} rot size} name token players {id} id}
  }
`

const mutationBackgroundLayer = gql`
  mutation setBackgroundLayer($layer:JSON!){
    updateBackgroundLayer(layer:$layer) {layer}
  }
`

export default async function (context) {
  store = context.store;

  loadCharacters();
  subscribeCharacterUpdate();
  //setBackgroundLayer({test: 1})
  loadBackground();
}

export function setCharacterPosition(charcterID, point) {
  apolloClient.mutate({
    mutation: mutationCharacterPosition,
    variables: {
      id: charcterID,
      x: point.x,
      y: point.y
    }
  }).catch(console.error);
}

function setBackgroundLayer(layer) {
  apolloClient.mutate({
    mutation: mutationBackgroundLayer,
    variables: {
      layer: layer
    }
  }).catch(console.error);
}

function subscribeCharacterUpdate() {
  apolloClient.subscribe({
    query: updateCharacterSubscription
  }).subscribe({
    next({data}) {
      store.commit("character/updateCharacter", data.updateCharacter);
      tokenInit();
    }
  });
}

function loadCharacters() {
  apolloClient.query({query: allCharacters})
    .then(({data}) => {
      store.commit("character/loadCharacters", data.allCharacters);
      tokenInit();
    })
    .catch(console.error);
}

function loadBackground() {
  apolloClient.query({query: getBackgroundLayer})
    .then(({data}) => {
      store.commit("background/setBackgroundLayer", JSON.parse(data.getBackgroundLayer.layer));
      backgroundInit();
    })
    .catch(console.error);
}
