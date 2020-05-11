import * as path from "path";
import { readFile } from "fs";

type RoombaResult = {
  resultString: string;
  traversalSteps: number[][];
  dirtLocations: string[];
  finalPositionRaw: [number, number];
  initialPositionRaw: [number, number];
  dirtCount: number;
  finalMatrix: string;
  originalMatrix: string;
  directions: string;
};

export default class Roomba {
  inputString: string = "";
  matrix: number[][] = [[0]];
  directions: string = "";
  currentPosition: [number, number] = [0, 0];
  dirtLocations: string[] = [];

  /**
   * @param pathToInputFile [string] - path to input file
   * @returns Promise resolving to an input string or an error
   */
  readFromFile(pathToInputFile: string): Promise<string | Error> {
    const targetFile = path.resolve(pathToInputFile);

    return new Promise((resolve, reject) =>
      readFile(targetFile, (e, d) => {
        if (e) reject(`Error importing file: ${e.message}`);

        resolve(d.toString());
      })
    );
  }

  /**
   * @param inputString - input string of given matrix format
   */
  ingestInput(this: Roomba, inputString: string): void {
    const [
      dimensions,
      initialCoordinates,
      ...remainingRows
    ] = inputString.split("\n");

    const [width, height] = dimensions.split(" ");

    const [row, col] = initialCoordinates.split(" ");

    this.currentPosition = [+row, +height - 1 - +col];

    this.directions = <string>remainingRows.pop();

    this.dirtLocations = remainingRows.map((l) => {
      const [x, y] = l.split(" ");

      // account for y inversion when mapping indeces
      return `${+x},${+height - +y - 1}`;
    });

    this.matrix = Roomba.prototype.renderMatrix(
      +width,
      +height,
      this.dirtLocations
    );
  }

  private renderMatrix(
    width: number,
    height: number,
    dirtLocations: string[]
  ): number[][] {
    const locSet = new Set(dirtLocations);

    return Array(height)
      .fill(null)
      .map((r, y) =>
        Array(width)
          .fill(null)
          .map((v, x) => {
            return locSet.has(`${x},${y}`) ? 1 : 0;
          })
      );
  }

  traverse(this: Roomba): RoombaResult {
    const { directions, matrix, currentPosition, dirtLocations } = this;

    let [x, y] = currentPosition;
    const traversalSteps = [];
    let dirtCount = 0;
    const originalMatrix = [...matrix.map((r) => [...r])];

    // iterate through directions
    for (let i = 0; i < directions.length; i++) {
      traversalSteps.push([x, matrix.length - 1 - y]);
      // check if we are on a 1 or 0
      if (matrix[y][x] === 1) {
        matrix[y][x] = 0;
        // increment counter
        dirtCount++;
      }

      const nextDirection = directions.charAt(i);

      // move coordinates based on current direction step
      if (nextDirection === "N" && y >= 1) {
        y--;
      } else if (nextDirection === "S" && y < matrix.length - 1) {
        y++;
      } else if (nextDirection === "E" && x < matrix[0].length - 1) {
        x++;
      } else if (nextDirection === "W" && x >= 1) {
        x--;
      }
    }

    traversalSteps.push([x, matrix.length - 1 - y]);

    // return last location
    return {
      // transform y back into expected format (accounts for y inversion)
      resultString: `${x} ${matrix.length - 1 - y}\n${dirtCount}`,
      finalPositionRaw: [x, y],
      initialPositionRaw: currentPosition,
      traversalSteps,
      dirtLocations,
      dirtCount,
      finalMatrix: JSON.stringify(matrix),
      originalMatrix: JSON.stringify(originalMatrix),
      directions,
    };
  }
}
