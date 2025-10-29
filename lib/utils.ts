// Helper function to format duration from seconds to MM:SS
export const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

// Helper function to format total duration into a readable string (HH:MM:SS)
export const formatTotalDuration = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    if (hours > 0) {
        return `${hours}:${minutesStr}:${secondsStr}`;
    } else {
        return `${minutes}:${secondsStr}`;
    }
};
