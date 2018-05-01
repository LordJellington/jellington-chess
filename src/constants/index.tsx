export const INCREMENT_ENTHUSIASM = 'INCREMENT_ENTHUSIASM';
export type INCREMENT_ENTHUSIASM = typeof INCREMENT_ENTHUSIASM;

export const DECREMENT_ENTHUSIASM = 'DECREMENT_ENTHUSIASM';
export type DECREMENT_ENTHUSIASM = typeof DECREMENT_ENTHUSIASM;

export const SET_BOARD_STATE_AT_TURN_START: string = 'SET_BOARD';
export const SET_PHASE: string = 'SET_PHASE';
export const ADD_SQUARE_MOVED_TO: string = 'ADD_MOVED_PIECE';
export const RESET_SQUARES_MOVED_TO_ON_CURRENT_TURN: string = 'RESET_PIECES_THAT_HAVE_MOVED_ON_CURRENT_TURN';
export const ADD_AI_PIECES_MOVED: string = 'ADD_AI_PIECES_MOVED';
export const INCREMENT_TURN_NUMBER: string = 'INCREMENT_TURN_NUMBER';
export const RESET_TURN_NUMBER: string = 'RESET_TURN_NUMBER';
export const SET_GAME_WON: string = 'SET_GAME_WON';
export const SET_GAME_MODE: string = 'SET_GAME_MODE';

export const COLUMNS: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export const ROUNDS_TO_WIN: number = 20;