<script>
/**
 * 试卷 - 试卷预览 - 试卷命名表单
 *
 * @author  huojinzhao
 */

import mapData from '@/assets/china.json'

export default {
  name: 'PaperPreviewForm',

  props: {
    // 试卷数据
    data: {
      type: Object,
      required: true,
    },
  },

  filters: {
    translateToObject(value) {
      return { ...value }
    },
  },

  data: () => ({

    /* before：buttonRadio数据 */

    year: { label: '', data: [] },

    grade: { label: '', data: [] },

    subjects: { label: '', data: [] },

    paper_type: { label: '', data: [] },

    // 来源的假数据
    mapData,

    // 表单验证规则
    paperRules: {
      year: [
        { required: true, message: '必须选择时间' },
      ],
      subject_type: [
        { required: true, message: '必须选择分科信息' },
      ],
      grade: [
        { required: true, message: '必须选择年级信息' },
      ],
      paper_type: [
        { required: true, message: '必须选择类型信息' },
      ],
      display_name: [
        { required: true, message: '必须填写试卷标题' },
      ],
    },
  }),

  computed: {
    subjectId() {
      const subjectId = this.$route.query['equal[grade_range_subject_id]']
      return subjectId || 1
    },
  },

  methods: {
    /* --- Initialization --- */

    fetchPreCondition(subjectId) {
      const host = '/paper/store_before'
      const url = subjectId
        ? `${host}?grade_range_subject_id=${subjectId}` : `${host}`

      return this.$http.get(url)
        .then(({
          year,
          grade,
          subject_type,
          paper_type,
        }) => {
          this.year = year
          this.grade = grade
          this.paper_type = paper_type
          this.subjects = subject_type
        })
    },

    /* --- Control --- */

    vm_addSource() {
      this.$refs.sources.validate((valid) => {
        if (valid) this.data.places.push([])
      })
    },

    vm_removePlace(index) {
      this.data.places.splice(index, 1)
    },

    /* --- Assistance --- */

    validateSource(index) {
      return (rule, value, callback) => {
        if (!this.data.places[index].length) {
          callback(new Error('来源信息不能为空'))
          return false
        }
        callback()
        return true
      }
    },

    getDisplayName(value, list, prefix = '', suffix = '') {
      if (!value) return ''
      const target = list.find(item => item.value === value)
      return `${prefix}${target.display_name}${suffix}`
    },

    /**
     * 通过places[0]，兑换cascader数据的displayname
     *
     * @param {Array} place - cascader绑定的值
     */
    getPlaceName(index = 0, source = this.mapData) {
      const place = source
        .find(item => item.value === this.data.places[0][index])

      if (place.children) {
        return `${place.label}${this.getPlaceName(index + 1, place.children)}`
      }

      return place.label
    },

    /* --- Business --- */

    vm_autoName(switcher = true) {
      if (!switcher) return

      const paper = this.data
      const display = this.getDisplayName
      const placeName = this.data.places[0].length
        ? this.getPlaceName()
        : ''

      paper.display_name = `${display(paper.year, this.year.data, '', '年')}`
        + ` ${placeName}`
        + ` ${display(paper.grade, this.grade.data)}`
        + ` ${display(paper.paper_type, this.paper_type.data)}`
        + `${display(paper.subject_type, this.subjects.data, '(', ')')}`
    },

    $_validate() {
      let result = true

      this.$refs.sources
        .validate((valid) => { result = valid && result })

      this.$refs.paperConfig
        .validate((valid) => { result = valid && result })

      return result
    },
  },

  created() {
    this.fetchPreCondition(this.subjectId)
  },
}
</script>

<template>
  <div class="paper-preview-form">
    <!-- 来源 -->
    <Form
      class="paper-preview-form__source"
      :label-width="80"
      ref="sources"
      :model="data.places | translateToObject"
    >
      <Form-item
        v-for="(place, index) in data.places"
        :key="index"
        :prop="`${index}`"
        label="来源"
        :rules="[{ required: true, validator: validateSource(index) }]"
      >
        <Cascader
          :data="mapData"
          v-model="data.places[index]"
          :clearable="false"
          @input="() => vm_autoName(index === 0)"
        ></Cascader>
        <Icon
          v-show="index"
          type="android-delete"
          @click.native="vm_removePlace(index)"
        ></Icon>
      </Form-item>
    </Form>

    <!-- 添加来源 -->
    <div class="paper-preview-form__source-add">
      <Button
        type="dashed"
        @click="vm_addSource"
      >+增加来源</Button>
    </div>

    <!-- 编辑信息 -->
    <Form
      class="paper-preview-form__info"
      :label-width="80"
      :model="data"
      :rules="paperRules"
      ref="paperConfig"
    >
      <!-- 时间 -->
      <Form-item
        class="paper-preview-form__info-time"
        :label="year.label"
        prop="year"
      >
        <AppButtonRadio
          v-model="data.year"
          :data="year.data"
          size="small"
          @change="vm_autoName"
        />
      </Form-item>
      <!-- 科目 -->
      <Form-item
        :label="subjects.label"
        prop="subject_type"
      >
        <AppButtonRadio
          v-model="data.subject_type"
          :data="subjects.data"
          size="small"
          @change="vm_autoName"
        />
      </Form-item>
      <!-- 年级 -->
      <Form-item
        :label="grade.label"
        prop="grade"
      >
        <AppButtonRadio
          v-model="data.grade"
          :data="grade.data"
          size="small"
          @change="vm_autoName"
        />
      </Form-item>
      <!-- 试卷类型 -->
      <Form-item
        :label="paper_type.label"
        prop="paper_type"
      >
        <AppButtonRadio
          v-model="data.paper_type"
          :data="paper_type.data"
          size="small"
          @change="vm_autoName"
        />
      </Form-item>
      <Form-item
        class="paper-preview-form__info-title"
        label="试卷标题"
        prop="display_name"
      >
        <Input
          v-model="data.display_name"
        ></Input>
      </Form-item>
    </Form>
  </div>
</template>

<style lang="less">
@import '~vars';

.button-dashed-color(@text, @bd: transparent) {
  border-color: @bd;
  color: @text;
  cursor: pointer;

  &:hover {
    border-color: lighten(@bd, 8%);
    color: lighten(@text, 8%);
  }

  &:active {
    border-color: darken(@bd, 8%);
    color: darken(@text, 8%);
  }
}

.paper-preview-form__source {

  & .ivu-cascader {
    display: inline-block;
    margin-left: 8px;
    width: 500px;
  }

  & .ivu-icon-android-delete {
    .button-dashed-color(@warning-color);

    display: inline-block;
    margin-left: 15px;
    vertical-align: middle;
    font-size: 18px;
  }

  &-add {
    margin: 20px 0 10px 0;
    padding-left: 350px;

    & > button {
      .button-dashed-color(@info-color, @info-color);

      padding: 5px 30px;
    }
  }
}

.paper-preview-form__info {

  &-time {

    & .ivu-select {
      display: inline-block;
      width: 200px;
    }
  }

  &-title {

    & .ivu-input-wrapper {
      margin-left: 8px;
      width: 500px;
    }
  }
}
</style>