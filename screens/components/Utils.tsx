// utils.js

/**
 * Function to format time from seconds to mm:ss
 * @param {number} seconds - The time in seconds
 * @returns {string} - The formatted time string in mm:ss format
 */
export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };