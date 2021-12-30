// 封装首页的全部请求，类似于angular的服务
import { request } from "./request";

export function getHomeMultidata() {
  return request({
    url: "/home/multidata",
  });
}

export function getHomeGoods(type, page) {
  return request({
    url: "/home/data",
    params: {
      type,
      page,
    },
  });
}
