<script>
/**
 * 试卷 - 试卷预览 - 题目组件
 *
 * @author  huojinzhao
 */

import Question from './Question'

export default {
  name: 'PaperPreviewQuestion',

  components: {
    Question,
  },

  props: {
    // 试题数据
    data: {
      type: Object,
      required: true,
    },

    // index in section.questions
    qIndex: Number,

    // index in paper's questions
    pIndex: Number,

    // 试题长度
    qLength: {
      type: Number,
      required: true,
    },

    // 试题宽度
    width: {
      type: [Number, String],
      default: 790,
    },
  },

  methods: {
    /* --- Business --- */

    v_changeScore(score) {
      this.$emit('input', score)
    },

    // 换题的逻辑放到最后再做
    v_changeQuestion() {
      this.$emit('on-change-question')
    },

    v_deleteQuestion() {
      this.$emit('on-delete', this.qIndex)
    },

    v_sortQuestion(type) {
      this.$emit('on-sort', this.qIndex, type)
    },

    vm_fixDuration(opposite, val) {
      const trigger = opposite === 'excellent_duration'
        ? this.data[opposite] < val
        : this.data[opposite] > val

      if (trigger) this.data[opposite] = val
    },
  },
}
</script>

<template>
  <div class="paper-preview-question">
     <!-- 题目内容 -->
    <Question
      :index="pIndex"
      :data="data"
      :width="width"
    />
    <!-- 操作条 -->
    <div class="paper-preview-question__recbar">
      <span>答题时长</span>
      <InputNumber
        size="small"
        v-model="data.excellent_duration"
        :min="0"
        @on-change="(val) => vm_fixDuration('normal_duration', val)"
      ></InputNumber>
      <InputNumber
        size="small"
        v-model="data.normal_duration"
        :min="0"
        @on-change="(val) => vm_fixDuration('excellent_duration', val)"
      ></InputNumber>
      <span>分值</span>
      <InputNumber
        size="small"
        :min="0"
        :value="data.score"
        @on-change="v_changeScore"
      ></InputNumber>
      <Button
        v-if="false"
        size="small"
      >
        智能换题
      </Button>
      <Button
        size="small"
        @click="v_deleteQuestion"
      >
        删除
      </Button>
      <Button
        size="small"
        :disabled="qIndex === 0"
        @click="v_sortQuestion('up')"
      >
        上移
      </Button>
      <Button
        size="small"
        :disabled="qIndex === qLength - 1"
        @click="v_sortQuestion('down')"
      >
        下移
      </Button>
    </div>
  </div>
</template>

<style lang="less">
@import './style/paper';

.paper-preview-question {
  .question();

  &:hover {
    .paper-preview-question__recbar {
      display: block;
    }
  }

  &__recbar {
    .recbar();
  }
}
</style>
