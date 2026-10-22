export const formatTime = milliseconds => {
    const isOvertime = milliseconds < 0;
    const totalSeconds = Math.abs(milliseconds) / 1000;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds - mins * 60;
    return `${isOvertime ? '+' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};