import { makeAutoObservable } from "mobx";

export const userStore = makeAutoObservable({
  data: [],
  setMyObject(object) {
    if (!object) {
      console.log("No Data");
      this.data = {};
      return;
    }

    this.data = object;

    console.log("this.data");
    console.log(this.data);
  },
});
