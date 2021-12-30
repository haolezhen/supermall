<template>
  <div>
    <swiper>
      <swiper-item v-for="item in banners" :key="item.link">
        <a :href="item.link">
          <img :src="item.image" alt="" @load="swiperImgLoad()" />
        </a>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from "@/components/common/swiper";

export default {
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: { Swiper, SwiperItem },
  methods: {
    swiperImgLoad() {
      this.$emit('swiperImgLoad')
    }
  }
};
</script>

<style scoped>
</style>