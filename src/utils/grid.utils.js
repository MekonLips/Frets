import { NOTES_NUM, GRID_BASE_WIDTH, GRID_ROW_HEIGHT, GRID_ROW_HEIGHT_MIN } from '../config/frets.config';

export const fretPosition = fret => 100 / Math.pow(2, fret / NOTES_NUM);

export const columnWidth = fret => (Math.round((fretPosition(fret - 1) - fretPosition(fret)) * 10000) / 10000) * GRID_BASE_WIDTH;

export const gridHeight = strings => `${GRID_ROW_HEIGHT * strings}vh`;

export const gridMinHeight = strings => `${GRID_ROW_HEIGHT_MIN * strings}px`;

export const calcWidth = num => {
    let width = 0;
    for (let i = 0; i < num; i++)
        width += columnWidth(i);
    return width;
};

export const gridColumns = num => {
  const cols = [];
  for (let i = 0; i < num; i++)
      cols.push(`${(columnWidth(i) * calcWidth(NOTES_NUM + 2) / 100)}vw`);
  return cols.join(' ');
};