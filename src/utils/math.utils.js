export const minmax = (val, min, max) => Math.max(Math.min(val, max), min);

export const distanceTo = (x1, y1, x2, y2) => Math.sqrt((Math.pow(x2 - x1, 2)) + (Math.pow(y2 - y1, 2)));

export const withinSquare = (x, y, x1, x2, y1, y2) => x > x1 && x < x2 && y > y1 && y < y2 ? true : false;

export const ellipseDistanceCheck = (x, y, x1, y1, rx, ry) => (((x - x1) * (x - x1)) / (rx * rx)) + (((y - y1) * (y - y1)) / (ry * ry));

export const withinEllipse = (x, y, x1, y1, rx, ry) => ellipseDistanceCheck(x, y, x1, y1, rx, ry) <= 1;

export const line = (x, y, x0, y0, x1, y1) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;
    while(true) {
        // const rx = Math.round(x0);
        // const ry = Math.round(y0);
        // const idx = convertCoordsToIdx(rx, ry, imgData.width, 4);
        // imgData.data[idx+0] = rgba.r;
        // imgData.data[idx+1] = rgba.g;
        // imgData.data[idx+2] = rgba.b;
        // imgData.data[idx+3] = rgba.a;
        if ((x0 === x1) && (y0 === y1)) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
};

export const convertIdxToCoords = (i, w, stride = 4) => ({ x: i % (w * stride) / stride, y: Math.floor(i / (w * stride)) });

export const convertCoordsToIdx = (x, y, w, stride = 4) => stride * (y * w + x);