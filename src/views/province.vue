<template>
  <div id="map"></div>
  <v-alert :model-value="gaming" class="myAlert">
    <template #title>请找到: {{ gameArr[currentIndex].name }} </template>
    {{ currentIndex + 1 }} / {{ gameArr.length }}
    <span
      class="text-caption"
      v-if="
        gameArr[currentIndex].name == '澳门特别行政区' ||
        gameArr[currentIndex].name == '香港特别行政区'
      "
      >国土幅员辽阔, 可活用缩放功能, 在南方细细寻找(虚线标识的区域)</span
    >
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
    <v-spacer></v-spacer>
    点击开始, 即可将中国34个省级行政区随机排列, 根据提示点击地图上对应的区块,
    正确为绿色, 错误则为红色
  </v-footer>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/app";
import { onMounted, ref } from "vue";
let store = useAppStore();
import { watch } from "vue";
import { shuffle } from "@/plugins/utils";

let disList: any;
let gaming = ref(false);
let gameover = ref(false);

watch(
  () => store.currentGame,
  (val: any) => {
    console.log(val);
    if (val == "province") {
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
      SearchDistricts(AMap);

      disList = new AMap.DistrictLayer.Country({
        zIndex: 10,
        styles: {
          fill: "white",
        },
      });

      var map = new AMap.Map("map", {
        center: [105.5, 34.5],
        showIndoorMap: false,
        zoom: 4.5,
        defaultCursor: "pointer",
        layers: [disList],
      });

      store.setMap(map);

      map.on("click", function (ev: any) {
        var px = ev.pixel;
        var props = disList.getDistrictByContainerPos(px);
        if (props) {
          var adcode = props.adcode;

          if (adcode) {
            let color = "green";
            if (gaming.value) {
              if (gameArr.value[currentIndex.value].adcode == adcode) {
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
                return props.adcode == adcode ? color : "white";
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
function SearchDistricts(AMap: any) {
  AMap.plugin("AMap.DistrictSearch", function () {
    var districtSearch = new AMap.DistrictSearch({
      // 关键字对应的行政区级别，country表示国家
      level: "province",
      //  显示下级行政区级数，1表示返回下一级行政区
      subdistrict: 1,
    });
    // 搜索所有省/直辖市信息
    districtSearch.search("中国", function (status: any, result: any) {
      // 查询成功时，result即为对应的行政区信息
      console.log(status);
      if (result.info == "OK") {
        store.setProvinces(result.districtList[0].districtList);
      }
    });
  });
}

let currentIndex = ref(0);
let gameArr = ref<any>();
let right = ref(0);
let err = ref(0);

function init() {
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
  gameArr.value = shuffle(store.province);
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
