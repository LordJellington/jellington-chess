import { COLUMNS } from '../constants';

export class CommonHelper {

    public static clone = (obj: any): any => {

        return JSON.parse(JSON.stringify(obj));

    }

    public static getPiecesOnBoard = (colour: string, chess: any): number => {
        let pieces: number = 0;

        for (let i: number = 0; i < COLUMNS.length;  i++) {
            for (let j: number = 1; j <= 8; j++) {
                if (chess.get(COLUMNS[i] + j) && chess.get(COLUMNS[i] + j).color === colour) {
                    pieces++;
                }
            }
        }

        return pieces;
    }

}