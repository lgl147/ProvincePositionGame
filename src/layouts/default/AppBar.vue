<template>
  <v-app-bar>
    <v-btn
      color="primary"
      :variant="
        router.currentRoute.value.name == item.name ? 'elevated' : 'outlined'
      "
      class="mr-2"
      @click="router.push({ name: item.name })"
      v-for="(item, index) in routes"
      :key="index"
      >{{ item.text }}</v-btn
    >
    <v-spacer></v-spacer>
    <v-btn @click="game" color="primary"
      >{{ store.currentGame ? "重置" : "开始" }}
      <v-icon>mdi-play-circle</v-icon></v-btn
    >
    <v-btn @click="show">显示</v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
let router = useRouter();
import { useAppStore } from "@/store/app";
import { nextTick } from "vue";
let store: any = useAppStore();
let routes = ref<any>([
  {
    name: "province",
    text: "省份",
  },
  {
    name: "country",
    text: "国家",
  },
]);
function game() {
  if (store.currentGame) store.gameStart(null);
  nextTick(() => {
    store.gameStart(router.currentRoute.value.name);
  });
}
function show() {
  console.log(store.map.getCenter(), store.map.getZoom());
}
</script>
