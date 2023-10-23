// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    //
    map: null,
    province: [],
    currentGame: null,
  }),
  actions: {
    setMap(value: any) {
      this.map = value || null;
    },
    setProvinces(value: any) {
      this.province = value || null;
    },
    gameStart(value: any) {
      this.currentGame = value || null;
    },
  },
});
