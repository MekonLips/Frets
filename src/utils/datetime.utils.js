export const formatTime = seconds => {
    const mins = Math.floor(seconds / 1000 / 60);
    const secs = (seconds / 1000) - mins * 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};