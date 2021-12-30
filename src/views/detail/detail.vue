<template>
  <div class="detail">
    <detail-nav-bar
      @titleClick="titleClick"
      class="detail-nav"
      ref="nav"
    ></detail-nav-bar>
    <scroll
      class="content"
      @scroll="contentScroll"
      ref="scroll"
      :pullUpLoad="true"
    >
      <detail-swiper :topImages="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detailInfo="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>
      <detail-param-info
        ref="params"
        :paramInfo="paramInfo"
      ></detail-param-info>
      <detail-comment-info
        ref="comment"
        :commentInfo="commentInfo"
      ></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backTopClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import DetailNavBar from "./childComponents/DetailNavBar.vue";
import DetailSwiper from "./childComponents/DetailSwiper.vue";
import DetailBaseInfo from "./childComponents/DetailBaseInfo.vue";
import DetailShopInfo from "./childComponents/DetailShopInfo.vue";
import DetailGoodsInfo from "./childComponents/DetailGoodsInfo.vue";
import DetailParamInfo from "./childComponents/DetailParamInfo.vue";
import DetailCommentInfo from "./childComponents/DetailCommentInfo.vue";
import DetailBottomBar from "./childComponents/DetailBottomBar.vue";

import Scroll from "@/components/common/scroll/scroll.vue";
import GoodsList from "@/components/content/goods/GoodsList.vue";

import { backTopMixin } from "@/common/mixin.js";

import {
  getDetail,
  getRecommend,
  Goods,
  Shop,
  GoodsParam,
} from "@/network/detail";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    Scroll,
  },
  mixins: [backTopMixin],
  data() {
    return {
      iid: "",
      topImages: null,
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      currentIndex: 0,
      // isShowBackTop: false,
    };
  },

  created() {
    // 动态路由是params
    this.iid = this.$route.query.id;

    // 请求详情数据
    getDetail(this.iid).then((res) => {
      const data = res.result;
      // 获取顶部轮播信息
      this.topImages = data.itemInfo.topImages;

      // 获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 获取店铺信息
      this.shop = new Shop(data.shopInfo);

      // 保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 评论信息
      this.commentInfo = data.rate.cRate !== 0 ? data.rate.list[0] : {};

      // created并不会进行dom渲染
      // $nextTick是等到上面的数据在dom上渲染完以后，会调用这个函数
      // 但是图片依然是没有加载完的
      // this.$nextTick(() => {
      //   this.themeTopYs = [];
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      //   console.log(this.themeTopYs);
      // });
    });

    // 请求推荐数据
    getRecommend().then((res) => {
      // console.log(res);
      this.recommends = res.data.list;
    });
  },
  mounted() {
    // 在这里dom有了，但是在created里的异步请求可能还没回来，所以dom上没有数据，所以不能在这里获取offsetTop
  },
  updated() {},
  methods: {
    imageLoad() {
      // this.$refs.scroll.refresh()
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44);
      this.themeTopYs.push(Number.MAX_VALUE);
      // console.log(this.themeTopYs);
    },
    titleClick(index) {
      // console.log("index---", index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 1000);
    },
    // backTopClick() {
    //   // 第三个参数是秒数
    //   // 面向scroll组件开发，至于scroll组件里面怎么写的我不管
    //   this.$refs.scroll.scrollTo(0, 0);
    // },
    contentScroll(position) {
      // console.log(position);
      const positionY = -position.y;
      // positionY > 0 && positionY < this
      const length = this.themeTopYs.length;
      for (let i = 0; i < this.themeTopYs.length - 1; i++) {
        // if (
        //   positionY > this.themeTopYs[i] &&
        //   positionY < this.themeTopYs[+i + 1]
        // ) {
        // }
        i = +i;
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = i;
        }
      }

      this.isShowBackTop = position.y < -1000;
    },
    addToCart() {
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.newPrice;
      product.iid = this.iid;

      
    },
  },
};
</script>

<style scoped>
.detail {
  position: relative;
  height: 100vh;
  z-index: 10;
  background-color: #fff;
}

.detail-nav {
  position: relative;
  z-index: 10;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 49px);
}
</style>