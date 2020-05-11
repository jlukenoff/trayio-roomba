<template>
  <div id="app">
    <div class="header"><h2>Roomba App</h2></div>
    <form>
      <label for="inputUpload">Upload an input file</label>
      <input type="file" id="inputUpload" @change="setMatrix($event)" />
    </form>
    <div class="subtitle">
      or use default matrix.
    </div>
    <button type="button" @click="traverseMatrix" class="submit-btn">
      Traverse Room
    </button>
    <Board v-if="matrixProps.originalMatrix" v-bind="matrixProps" />
  </div>
</template>

<script>
import Board from "./Board.vue";
import gql from "graphql-tag";
export default {
  name: "App",
  components: {
    Board,
  },
  mounted() {
    this.traverseMatrix();
  },
  methods: {
    async setMatrix(e) {
      e.preventDefault();
      const text = await e.target.files[0].text();
      console.log(text);
      this.inputString = text.replace(/\n/g, "\\n");
    },
    async traverseMatrix() {
      fetch("graphql", {
        method: "POST",
        body: JSON.stringify({
          query: `{
          traversalResults(input:"${this.inputString}") {
            dirtCount
            resultString
            dirtLocations
            finalPositionRaw
            initialPositionRaw
            finalMatrix
            originalMatrix
            traversalSteps
            directions
          }
        }`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((c) => c.json())
        .then(({ data: { traversalResults } }) => {
          this.matrixProps = { ...traversalResults };
        })
        .catch(console.error);
    },
  },

  data: function() {
    return {
      matrixProps: {},
      inputString: "5 5\\n1 2\\n1 0\\n2 2\\n2 3\\nNNESEESWNWW",
      newMatrixArgs: {
        width: 5,
        height: 5,
        dirtPercentage: 30,
      },
    };
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  margin: auto;
  display: flex;
  flex-flow: column;
  align-items: center;
  text-align: center;
  min-height: 300px;

  button {
    -webkit-appearance: none;
    display: block;
    background: none;
    width: 15em;
    padding: 1em 0;
    border-radius: 2.5px;
  }

  .submit-btn {
    margin-top: 10px;
  }

  form {
    display: flex;
    flex-flow: column;
    max-width: 400px;
    padding: 20px;
    margin: auto;
  }

  .subtitle {
    text-align: center;
  }
}
</style>
