import { defineStore } from 'pinia'
// import axios from "axios"

export const breakPointsStore = defineStore('breakPoints', {
    state: () => ({
      screenWidth: window.innerWidth,

      mobileMinWidth: 320,
      mobileMaxWidth: 480,

      tabletMinWidth: 481,
      tabletMaxWidth: 1024,

      desktopMinWidth: 1025,
      desktopMaxWidth: 1080,

      largeMinWidth: 1081,
      largeMaxWidth: null,

      device: null

    }),

    actions: {
      // since we rely on `this`, we cannot use an arrow function
      deviceDetector() {
        if (!this.device) {
          if (this.screenWidth >= this.mobileMinWidth && this.screenWidth <= this.mobileMaxWidth) {
            this.device = "mobile"
          } else if (this.screenWidth >= this.tabletMinWidth && this.screenWidth <= this.tabletMaxWidth) {
            this.device = "tablet"
          } else if (this.screenWidth >= this.desktopMinWidth && this.screenWidth <= this.desktopMaxWidth) {
            this.device = "desktop"
          } else if (this.screenWidth >= this.largeMinWidth) {
            this.device = "large"
          }
        }
        console.log("device?", this.device);
      }
    },
  })

// @media (min-width:320px)  { /* smartphones, iPhone, portrait 480x320 phones */ }
// @media (min-width:481px)  { /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */ }
// @media (min-width:641px)  { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */ }
// @media (min-width:961px)  { /* tablet, landscape iPad, lo-res laptops ands desktops */ }
// @media (min-width:1025px) { /* big landscape tablets, laptops, and desktops */ }
// @media (min-width:1281px) { /* hi-res laptops and desktops */ }