import BackTop from "@/components/content/backTop/BackTop.vue";

export const backTopMixin = {
  components: { BackTop },
  data() {
    return {
      isShowBackTop: false,
    };
  },
  methods: {
    backTopClick() {
      // 第三个参数是秒数
      // 面向scroll组件开发，至于scroll组件里面怎么写的我不管
      this.$refs.scroll.scrollTo(0, 0);
    },
  },
};
