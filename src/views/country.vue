<template>
  <div id="map"></div>
  <v-alert :model-value="gaming" class="myAlert">
    <template #title>请找到: {{ gameArr[currentIndex].name }} </template>
    {{ currentIndex + 1 }} / {{ gameArr.length }}
  </v-alert>
  <v-alert
    :model-value="gameover"
    class="myAlert"
    color="success"
    title="complete!"
  >
    <div>正确: {{ right }} 个</div>
    <div>错误: {{ err }} 个</div>
    <div v-if="err == 0">太牛了, 竟然全对!</div>
  </v-alert>
  <v-footer app class="text-overline" height="24">
    <span></span>
    <v-spacer></v-spacer>
    国家列表来自<a
      href="https://github.com/umpirsky/country-list/tree/master"
      target="_blank"
      >umpirsky/country-list</a
    >, 但排除了港澳台, 其他未做修改
  </v-footer>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/app";
import { onMounted, ref } from "vue";
let store = useAppStore();
import { watch } from "vue";
import { shuffle } from "@/plugins/utils";
import country from "@/plugins/country";

let disList: any;
let gaming = ref(false);
let gameover = ref(false);
let map: any;

watch(
  () => store.currentGame,
  (val: any) => {
    console.log(val);
    if (val == "country") {
      gameStart();
    }
  }
);

function LoadMap() {
  window.AMapLoader.load({
    key: "ec0db4250d4d14bad480c89f9265b6c0",
    version: "2.0",
  })
    .then((AMap: any) => {
      disList = new AMap.DistrictLayer.World({
        zIndex: 10,
        styles: {
          fill: "white",
        },
      });

      console.log(disList, disList.getDistricts());

      map = new AMap.Map("map", {
        center: [151, 29],
        showIndoorMap: false,
        zoom: 2.5,
        defaultCursor: "pointer",
        layers: [disList],
      });

      store.setMap(map);

      map.on("click", function (ev: any) {
        var px = ev.pixel;
        var props = disList.getDistrictByContainerPos(px);
        if (props) {
          var name = props.NAME_CHN;
          console.log(props);

          if (name) {
            let color = "green";
            if (gaming.value) {
              if (gameArr.value[currentIndex.value].name == name) {
                color = "green";
                right.value++;
              } else {
                color = "red";
                err.value++;
              }
            }
            // 重置行政区样式
            disList.setStyles({
              fill: function (props: any) {
                return props.NAME_CHN == name ? color : "white";
              },
            });

            // 如果错误就不在进行下一题, 也可考虑做成继续的, 做完之后统计错题etc.
            if (!gaming.value) return;

            if (currentIndex.value >= gameArr.value.length - 1) {
              console.log(currentIndex.value, gameArr.value.length);
              gameover.value = true;
              gaming.value = false;
              return;
            }
            currentIndex.value++;
          }
        }
      });
    })
    .catch((e: Event) => {
      console.error(e); //加载错误提示
    });
}

let currentIndex = ref(0);
let gameArr = ref<any>();
let right = ref(0);
let err = ref(0);

function init() {
  map.setZoomAndCenter(2.5, [151, 29]);
  disList.setStyles({
    fill: "white",
  });
  right.value = 0;
  err.value = 0;
  gameover.value = false;
  currentIndex.value = 0;
  gaming.value = false;
}

function gameStart() {
  init();
  gaming.value = true;
  gameArr.value = shuffle(country);
  console.log(gameArr.value);
}
onMounted(() => {
  LoadMap();
});
</script>

<style lang="scss" scoped>
#map {
  height: 100%;
}
.myAlert {
  position: absolute;
  top: 84px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
