import TrackPlayer from 'react-native-track-player';

module.exports = async function () {
  // Set up the player
  await TrackPlayer.setupPlayer();

  // Update player options
  await TrackPlayer.updateOptions({
    // Capabilities for the notification and control center
    capabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_STOP,
      TrackPlayer.CAPABILITY_SEEK_TO,
    ],
    compactCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
    ],
    notificationCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_STOP,
    ],
    // Customize the notification (optional)
    notification: {
      title: 'Music Player',
      message: 'Playing your favorite tracks',
      icon: require('../../assets/logo/LOGO_ICON.png'), // Replace with your app's icon
    },
  });

  // Register playback service to handle events
  TrackPlayer.registerPlaybackService(() => {
    return async function () {
      // Handle remote play event
      TrackPlayer.addEventListener('remote-play', async () => {
        await TrackPlayer.play();
      });

      // Handle remote pause event
      TrackPlayer.addEventListener('remote-pause', async () => {
        await TrackPlayer.pause();
      });

      // Handle remote stop event
      TrackPlayer.addEventListener('remote-stop', async () => {
        await TrackPlayer.stop();
      });

      // Handle remote seek event
      TrackPlayer.addEventListener('remote-seek', async (position) => {
        await TrackPlayer.seekTo(position);
      });

      // Handle remote next event (optional)
      TrackPlayer.addEventListener('remote-next', async () => {
        await TrackPlayer.skipToNext();
      });

      // Handle remote previous event (optional)
      TrackPlayer.addEventListener('remote-previous', async () => {
        await TrackPlayer.skipToPrevious();
      });
    };
  });
};