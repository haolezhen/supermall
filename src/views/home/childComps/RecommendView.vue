<template>
  <div class="recommends">
    <div v-for="item in recommends" :key="item.link" class="recommends-item">
      <a :href="item.link">
        <img :src="item.image" alt="" />
        <div>{{ item.title }}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    recommends: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
.recommends {
  display: flex;
  width: 100%;
  padding: 10px 0 20px;
  text-align: center;
  font-size: 12px;
  border-bottom: 8px solid #eee;
}

.recommends-item {
  flex: 1;
}

.recommends-item img {
  width: 70px;
  margin-bottom: 10px;
}
</style>