export const formatTime = milliseconds => {
    const isOvertime = milliseconds < 0;
    const totalSeconds = Math.floor(Math.abs(milliseconds) / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${isOvertime ? '+' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};