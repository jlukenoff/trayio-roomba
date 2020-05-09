import * as path from "path";
import { readFile } from "fs";

export default class Roomba {
  inputString: string = "";
  matrix: number[][] = [[0]];
  directions: string = "";
  currentPosition: [number, number] = [0, 0];

  /**
   * @param pathToInputFile [string] - path to input file
   * @returns Promise resolving to an input string or an error
   */
  readFromFile(pathToInputFile: string): Promise<string | Error> {
    const targetFile = path.resolve(pathToInputFile);

    return new Promise((resolve, reject) => {
      return readFile(targetFile, (e, d) => {
        if (e) reject(`Error importing file: ${e.message}`);

        resolve(<string>d.toString());
      });
    });
  }

  /**
   * @param inputString - input string of given matrix format
   */
  ingestInput(this: Roomba, inputString: string): void {
    const [
      dimensions,
      initialCoordinates,
      ...dirtLocations
    ] = inputString.split("\n");

    const [width, height] = dimensions.split(" ");

    const [row, col] = initialCoordinates.split(" ");

    this.currentPosition = [+row, +col];

    this.directions = <string>dirtLocations.pop();

    this.matrix = Roomba.prototype.renderMatrix(+width, +height, dirtLocations);
  }

  private renderMatrix(
    width: number,
    height: number,
    dirtLocations: string[]
  ): number[][] {
    const locSet = new Set(dirtLocations);

    return Array(height)
      .fill(null)
      .map((_, y) =>
        Array(width)
          .fill(null)
          .map((_, x) => {
            return locSet.has(`${x} ${y}`) ? 1 : 0;
          })
      );
  }

  traverse(this: Roomba) {
    const { directions, matrix, currentPosition } = this;

    // start from bottom left
    let [row, col] = currentPosition;
    let dirtCount = 0;

    // iterate through directions
    for (let i = 0; i < directions.length; i++) {
      // check if we are on a 1 or 0
      if (matrix[row][col] === 1) {
        // increment counter
        dirtCount++;
      }

      const nextDirection = directions.charAt(i);

      // move coordinates based on current direction step
      if (nextDirection === "W" && row >= 1) {
        row--;
      } else if (nextDirection === "E" && row < matrix.length - 1) {
        row++;
      } else if (nextDirection === "N" && col < matrix[0].length - 1) {
        col++;
      } else if (nextDirection === "S" && col >= 1) {
        col--;
      }
    }

    // return last location
    return `${row} ${col}\n${dirtCount}`;
  }
}
