<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabControlSticky"
    ></tab-control>
    <scroll
      class="content"
      ref="scroll"
      :probeType="3"
      :pullUpLoad="true"
      @scroll="contentScroll"
      @pullingUp="loadMore"
    >
      <home-swiper
        :banners="banners"
        @swiperImgLoad="swiperImgLoad()"
      ></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      ></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backTopClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper.vue";
import RecommendView from "./childComps/RecommendView.vue";
import FeatureView from "./childComps/FeatureView.vue";

import NavBar from "@/components/common/navbar/NavBar";
import TabControl from "@/components/content/tabControl/TabControl.vue";
import GoodsList from "@/components/content/goods/GoodsList.vue";
import Scroll from "@/components/common/scroll/scroll.vue";

import { getHomeMultidata, getHomeGoods } from "@/network/home";
import { backTopMixin } from "@/common/mixin.js";

export default {
  mixins: [backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: {
          page: 0,
          list: [],
        },
        new: {
          page: 0,
          list: [],
        },
        sell: {
          page: 0,
          list: [],
        },
      },
      currentType: "pop",
      tabOffsetTop: 0,
      isSwiperLoad: false,
      isTabControlSticky: false,
      saveY: 0,
    };
  },
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    Scroll,
    TabControl,
    GoodsList,
  },
  created() {
    // 一般不在created写具体逻辑，抽离到methods里面
    this.getHomeMultidata();

    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  destroyed() {
    // console.log("home组件销毁了");
  },
  activated() {
    // console.log("activated");
    this.$refs.scroll.scroll.refresh();
    this.$refs.scroll.scrollTo(0, this.saveY, 10);
  },
  deactivated() {
    // console.log("deactivated");
    this.saveY = this.$refs.scroll.scroll.y;
  },
  mounted() {
    // console.log(this.$refs.tabControl2.$el.offsetTop);
    // $el用于获取组件中的元素
    // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
  },
  methods: {
    // 网络请求相关
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },

    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp();
      });
    },

    tabClick(index) {
      const arr = ["pop", "new", "sell"];
      this.currentType = arr[index];
      // switch (index) {
      //   case 0:
      //     this.currentType = "pop";
      //     break;
      //   case 1:
      //     this.currentType = "new";
      //     break;
      //   case 2:
      //     this.currentType = "sell";
      //     break;
      //   default:
      //     break;
      // }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    // backTopClick() {
    //   // 第三个参数是秒数
    //   // 面向scroll组件开发，至于scroll组件里面怎么写的我不管
    //   this.$refs.scroll.scrollTo(0, 0);
    // },

    contentScroll(position) {
      // console.log(position);
      this.isShowBackTop = position.y < -1000;

      this.isTabControlSticky = -position.y > this.tabOffsetTop;
    },

    loadMore() {
      this.getHomeGoods(this.currentType);
    },

    swiperImgLoad() {
      if (!this.isSwiperLoad) {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
        this.isSwiperLoad = true;
        // console.log("tabOffsetTop---", this.tabOffsetTop);
      }
    },
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  /* vh: viewport height 视口高度；100vh表示100%的视口 */
  height: 100vh;
  position: relative;
}

.home-nav {
  /* position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 9; */
  background-color: var(--color-tint);
  color: #fff;
}

.tab-control {
  /* position: sticky; */
  position: relative;
  /* top: 44px; */
  z-index: 9;
}

/* 49px是下面导航的高度 */
/* .content {
  height: 300px;
  height: calc(100% - 49px);
  overflow: hidden;
} */

.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
}

.fixed {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
}
</style>