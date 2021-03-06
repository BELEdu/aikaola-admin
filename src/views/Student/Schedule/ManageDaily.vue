<template>
  <div class="manage-daily">
    <App-table-form @on-submit="search">
      <Form-item>
        <Input v-model="likeValue" placeholder="请输入关键字">
        <Select v-model="likeKey" slot="prepend" style="width:6em;">
          <Option v-for="key in likeKeys" :key="key.value" :value="key.value">{{ key.label }}</Option>
        </Select>
        </Input>
      </Form-item>
      <Form-item>
        <app-date-picker
          v-model="query['equal[course_date]']"
          placeholder="请选择日期"
        ></app-date-picker>
      </Form-item>
      <Form-item>
        <Select v-model="query['equal[course_status]']" placeholder="课表状态" style="width:6em;">
          <Option value="">全部</Option>
          <Option v-for="item in scheduleStatus" :key="item.value" :value="item.value">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
    </App-table-form>
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col :span="12">
        <h2><Icon type="ios-calendar"/> {{`${!this.$route.params.id ? '我的课表' : currentTip.realname + '的课表'}`}}</h2>
      </Col>
      <Col :span="12" style="text-align: right">
        待上课总数：{{ courseTip }}
      </Col>
    </Row>
    <!--日课表-->
    <Table class="app-table" :columns="columns" :data="dailyList.data" border @on-sort-change="sort"></Table>

    <!--分页-->
    <app-pager :data="dailyList" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--操作弹窗-->
    <course-modal
      :visible.sync="dialog.visible"
      :is-repeal="isRepeal"
      v-if="isDialogRender"
      @on-update="fetchData"
    ></course-modal>

    <!--查看学员笔记-->
    <notes-modal :visible.sync="dialog.notes"></notes-modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { STUDENT } from '@/store/mutationTypes'
  import { list } from '@/mixins'
  import { createButton } from '@/utils'
  import modal from './mixins/modal'

  export default {
    name: 'manage-daily',

    mixins: [list, modal],

    data() {
      return {
        likeKeys: [
          { label: '班级名称', value: 'classes_name' },
          { label: '排课专员', value: 'schedule_teacher_name' },
        ],

        likeKey: 'classes_name',

        query: {
          'equal[course_date]': null,
          'equal[course_status]': null,
        },

        columns: [
          { title: '班级名称', key: 'classes_name', align: 'center' },
          { title: '课序', key: 'sort_value', align: 'center' },
          { title: '上课日期', key: 'schedule_date', align: 'center' },
          { title: '上课时段', key: 'schedule_range', align: 'center' },
          { title: '计划课时', key: 'course_num', align: 'center' },
          { title: '实际课时', key: 'course_fact', align: 'center' },
          {
            title: '上课内容',
            align: 'center',
            render: (h, prams) => h('div', {
              domProps: {
                innerHTML: prams.row.chapter_name,
              },
            }),
          },
          { title: '排课专员', key: 'schedule_teacher_name', align: 'center' },
          { title: '状态', key: 'course_status_name', align: 'center' },
          {
            title: '操作',
            align: 'center',
            width: 140,
            render: createButton([
              { text: '确认排课',
                isShow: ({ row }) => row.schedule_operation.confirm,
                type: 'primary',
                click: (row) => {
                  this.handlerModal(row)
                },
              },
              { text: '确认上课',
                isShow: ({ row }) => row.schedule_operation.finish,
                type: 'primary',
                click: (row) => {
                  this.handlerModal(row)
                },
              },
              { text: '撤销',
                isShow: ({ row }) => row.schedule_operation.cancel,
                type: 'warning',
                click: (row) => {
                  this.handlerModal(row, true)
                },
              },
              { text: '评价',
                isShow: ({ row }) => row.schedule_operation.comment,
                type: 'primary',
                click: (row) => {
                  this.handlerModal(row)
                },
              },
              { text: '查看评价',
                isShow: ({ row }) => row.schedule_operation.showComment,
                type: 'primary',
                click: (row) => {
                  this.handlerModal(row)
                },
              },
              { text: '查看笔记',
                isShow: ({ row }) => row.schedule_operation.draft,
                type: 'primary',
                click: (row) => {
                  this.handlerNotesModal(row)
                },
              },
            ]),
          },
        ],
      }
    },

    computed: {
      ...mapState({
        scheduleStatus: state => state.dicts.course_status,
        currentTip: state => state.student.schedule.tip,
        dailyList: state => state.student.schedule.dailyList,
        courseTip: state => state.student.schedule.tip.ready_courses,
        userId: state => state.user.id,
      }),
    },

    watch: {
      userId() {
        if (!this.$route.params.id) {
          this.getData(this.parse(this.$route.query), this.$route)
        }
      },
    },

    methods: {
      getData(qs, to) {
        const cId = to.params.id || this.userId
        if (cId) {
          return this.$store.dispatch(STUDENT.SCHEDULE.DAILY_LIST, `${cId}${qs}`)
        }
        return false
      },
    },
  }
</script>
