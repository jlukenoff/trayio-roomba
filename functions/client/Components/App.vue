<template>
  <div id="app">
    <div class="header"><h2>Roomba App</h2></div>
    <form>
      <label for="inputUpload">Upload an input file (csv)</label>
      <input type="file" id="inputUpload" @change="setMatrix($event)" />
    </form>
    or
    <form>
      <label for="new-matrix-width">New Board Width</label>
      <input
        type="number"
        id="new-matrix-width"
        v-model="newMatrixArgs.width"
      />
      <label for="new-matrix-height">New Board Height</label>
      <input
        type="number"
        id="new-matrix-height"
        v-model="newMatrixArgs.height"
      />
      <label for="new-matrix-width">New Board Dirt Percentage</label>
      <div>
        <input
          type="number"
          id="new-matrix-dirt-percentage"
          v-model="newMatrixArgs.dirtPercentage"
          max="100"
        />%
      </div>
      <button type="button" @click="newBoard">
        Get New Random Matrix
      </button>
    </form>
    <button type="button" @click="getBoardTraversalDirections()">
      Get Traversal Directions
    </button>
    <Board :matrix="matrix" />
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
  methods: {
    async setMatrix(e) {
      e.preventDefault();
      const inputString = await e.target.files[0].text();
      console.log("inputString:", inputString);
      this.matrix = parseMatrixString(inputString);
    },

    async newBoard(e) {
      e.preventDefault();
      const {
        data: { newBoard } = { newBoard: "" },
      } = await this.$apollo.query({
        // Query
        query: gql`
          query($width: Int!, $height: Int!) {
            newBoard(width: $width, height: $height)
          }
        `,

        fetchPolicy: "no-cache",
        // Parameters
        variables: {
          width: +this.newMatrixArgs.width,
          height: +this.newMatrixArgs.height,
          dirtPercentage: +this.newMatrixArgs.dirtPercentage,
        },
        result({ data: { newBoard }, loading }) {
          if (!loading) {
            this.matrix = parseMatrixString(newBoard);
          }
        },
      });

      if (newBoard) {
        this.matrix = parseMatrixString(newBoard);
      }
    },

    async getBoardTraversalDirections() {
      // TODO: connect to graphql and implement traversal logic
      // Call to the graphql mutation
      const result = await this.$apollo.mutate({
        // Query
        mutation: gql`
          mutation($board: String!, $startingCoordinates: [Int]) {
            board(board: $board)
          }
        `,
        // Parameters
        variables: {
          label: this.newTag,
        },
      });
    },
  },

  data: function() {
    return {
      matrix: null,
      newMatrixArgs: {
        width: 5,
        height: 5,
        dirtPercentage: 30,
      },
    };
  },
};

function parseMatrixString(str) {
  return str.split("\n").map((r) => r.split(",").map((v) => +v));
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  margin: auto;
  display: flex;
  flex-flow: column;
  align-items: center;

  form {
    display: flex;
    flex-flow: column;
    max-width: 400px;
    padding: 20px;
    margin: auto;
  }
}
</style>
