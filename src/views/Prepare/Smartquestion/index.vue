<template>
  <div class="papercenter">
    <!-- 上部 搜索栏 -->
    <App-table-form @on-submit="search">
      <Form-item>
        <Date-picker format="yyyy/MM/dd" type="daterange" placeholder="请选择时间段..."></Date-picker>
      </Form-item>
      <Form-item>
        <Input placeholder="请输入关键字"></Input>
      </Form-item>
    </App-table-form>
    <!-- 上部 搜索栏 end -->
    <!-- 中部 列表title栏 -->
    <Row class="app-content-header">
      <h2 icon="">学员列表</h2>
    </Row>
    <!-- 中部 列表title栏 end -->
    <!-- 下部 列表展示-->
    <Table :data="fdata" :columns="fcol"></Table>
    <!-- 下部 列表展示 end -->
    <!-- 底部 分页 -->
    <app-pager></app-pager>
    <!-- 底部 分页 end -->
  </div>
</template>

<script>
/**
 * 备课管理 - 个性题库
 * @author hjz
 * @version 2017-06-27
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {

  data() {
    return {
      fcol: [
        { title: '学员姓名', key: 1, align: 'center' },
        { title: '地区', key: 2, align: 'center' },
        { title: '在读学校', key: 3, align: 'center' },
        { title: '当前年级', key: 4, align: 'center' },
        { title: '学科', key: 5, align: 'center' },
        { title: '知识点总数', key: 6, align: 'center' },
        { title: '试卷总数', key: 7, align: 'center' },
        {
          title: '操作',
          key: 8,
          align: 'center',
          width: 230,
          render: h => h(
            'div',
            [
              h(
                'Button',
                {
                  props: { size: 'small', type: 'text' },
                  class: 'color-info',
                  on: { click: this.checkInfo },
                },
                '查看试卷',
              ),
              h(
                'Button',
                {
                  props: { size: 'small', type: 'text' },
                  class: 'color-success',
                  on: { click: this.paperSmart },
                },
                '智能组卷',
              ),
              h(
                'Button',
                {
                  props: { size: 'small', type: 'text' },
                  class: 'color-info',
                },
                '人工组卷',
              ),
            ],
          ),
        },
      ],
      fdata: Array(10).fill(null).map(() => ({
        1: '李园园',
        2: '福建省厦门市',
        3: '蔡塘中学',
        4: '高中三年级',
        5: '【语文】【数学】【英语】',
        6: 100,
        7: 2,
      })),
    }
  },

  methods: {
    checkInfo() {
      this.$router.push('/prepare/papercenter/1')
    },
    paperSmart() {
      this.$router.push('/prepare/papercenter/smartpaper')
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.papercenter {

  & .ivu-form-item {
    display: inline-block;

    &:last-child {
      float: right;
      margin: 0;
    }
  }
}
</style>
