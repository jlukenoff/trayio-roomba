<template>
  <div class="matrix-container">
    <ul v-for="(row, rowIndex) in matrix" :key="rowIndex" class="matrix-row">
      <li
        v-for="(cell, cellIndex) in row"
        :key="cellIndex"
        class="matrix-cell"
        :class="{ filled: cell === 1 }"
      >
        <transition name="slide">
          <img
            src="https://storage.cloud.google.com/john-lukenoff-portoflio/static/roomba.jpg"
            alt="Roomba"
            v-if="`${rowIndex},${cellIndex}` === currentCoordinates.join(',')"
            class="roomba-img"
          />
        </transition>
        <!-- {{ cell }} -->
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Board",
  props: {
    matrix: {
      type: Array,
      required: false,
      default: "",
    },
    currentCoordinates: {
      type: Array,
      required: false,
      default: function() {
        return [0, 0];
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
  watch: {},
  mounted: function() {
    try {
      this.matrix = JSON.parse(this.matrix);
    } catch (e) {
      console.error(`Error parsing matrix ${this.props.matrix}: ${e.message}`);
    }
  },
};
</script>

<style lang="scss" scoped>
$border: 1px solid #333;
$cell-size: 50px;
$filledBg: #ccc;

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.matrix-container {
  display: flex;
  flex-flow: column;
  width: min-content;
  align-items: flex-start;
  margin: 0 auto;

  .matrix-row {
    list-style: none;
    display: inline-flex;
    flex-wrap: nowrap;
    margin: 0 20px;
    padding: 0;
    border-bottom: $border;

    &:first-of-type {
      border-top: $border;
    }

    .matrix-cell {
      padding: 5px;
      border-right: $border;
      min-width: $cell-size;
      min-height: $cell-size;

      &:first-of-type {
        border-left: $border;
      }

      &.filled {
        background-color: $filledBg;
      }

      .roomba-img {
        max-width: $cell-size;
      }
    }
  }
}
</style>
