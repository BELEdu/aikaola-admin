<template>
  <div id="app">
    <!--站点头部-->
    <app-header></app-header>

    <div class="app-body">
      <!--左侧导航-->
      <app-menu></app-menu>
      <!--右侧主内容区-->
      <div
        class="app-main"
        :class="{
          'app-main--loading': $store.state.loading
        }"
        ref="appMain"
      >
        <!--面包屑导航-->
        <div class="app-content">
          <Breadcrumb class="app-creadcrumb">
            <Breadcrumb-item
              v-for="item in breadcrumb"
              :key="item.link"
              :href="item.link"
            >
              {{ item.name }}
            </Breadcrumb-item>
          </Breadcrumb>
          <router-view @scrollToTop="scrollToTop"></router-view>
        </div>

        <!--站点底部-->
        <app-footer></app-footer>

        <!--数据加载动画-->
        <Spin size="large" fix v-show="$store.state.loading">
          <Icon class="spin-icon" type="load-c" :size="30"></Icon>
          <div class="spin-text">数据加载中，请稍后...</div>
        </Spin>
      </div>
    </div>

    <TheListDeletion></TheListDeletion>
  </div>
</template>

<script>
/**
 * 主应用内容
 * @author lmh
 * @version 2017-06-22
 */

import { mapState } from 'vuex'
import AppHeader from '@/components/AppHeader'
import AppMenu from '@/components/AppMenu'
import AppFooter from '@/components/AppFooter'
import TheListDeletion from '@/components/TheListDeletion'
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app',

  computed: {
    ...mapState(['token']),

    breadcrumb() {
      return this.$route.meta.breadcrumb
    },
  },

  methods: {
    // 表单提交出错后，会emit这个事件，这时候应该把app-main滚动回最顶上以方便用户查看错误信息
    scrollToTop() {
      this.$refs.appMain.scrollTop = 0
    },
  },

  watch: {
    // 每次切换路由时，都应该把app-main滚回最顶上
    $route() {
      this.$refs.appMain.scrollTop = 0
    },
  },

  components: {
    AppHeader,
    AppMenu,
    AppFooter,
    TheListDeletion,
  },

  created() {
    // 如果用户未登录，转跳到登陆页
    if (!this.token) {
      this.$router.push('/auth/login')
    } else {
      this.$store.dispatch(GLOBAL.DICTS.INIT)
    }
  },
}
</script>

<style lang="less">
.app-main--loading {
  overflow-y: hidden;
}

.ivu-spin {
  background-color: transparent
}

.spin-icon {
  opacity: 0;
  animation: spin 1s linear 1s infinite;
}

.spin-text {
  margin-top: 0.4em;
  opacity: 0;
  animation: fade-in 0.2s ease-in 1s forwards;
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}

@keyframes spin {
  from {
    opacity: 1;
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  to {
    opacity: 1;
    transform: rotate(360deg);
  }
}

// 防止ie下iview的表格出现滚动条
// 也许不是最好做法，可以考虑直接禁用滚动overflow: hidden;
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .app-main--loading {
    margin-right: 16px;
  }
}

// TODO:因为不支持css动画，ie9下没有loading提示
.ie {
  .app-main--loading {
    overflow-y: visible;
    margin-right: 0;
  }
}
</style>
