/**
 * Return the fixed-width tablature layout for one note.
 *
 * String numbers are 1-based and physical string 1 is the top row.
 * Ascending passes begin on the lowest physical row (stringCount) at the
 * left; descending passes begin on string 1 at the left.
 */
export const getTabLineWidth = stringCount => {
    if (!Number.isInteger(stringCount) || stringCount < 1)
        throw new RangeError('String count must be a positive integer.');

    // One leading hyphen, three characters per string, one trailing hyphen.
    return 2 + (3 * stringCount);
};

export const getTabFretPosition = (note, stringCount) => {
    if (!note || !Number.isInteger(note.string) || note.string < 1 || note.string > stringCount)
        throw new RangeError('Note string must be within the instrument string count.');

    const slotIndex = note.dir === 'up'
        ? stringCount - note.string
        : note.dir === 'down'
            ? note.string - 1
            : null;

    if (slotIndex === null)
        throw new TypeError('Note direction must be "up" or "down".');

    // Leave the first character as leading padding; each string owns a
    // three-character slot regardless of whether its fret has one or two digits.
    return 1 + (slotIndex * 3);
};
