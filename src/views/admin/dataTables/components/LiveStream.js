import React, { useEffect } from 'react';
import { Box, Center } from '@chakra-ui/react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css'; // Ensure you have the Video.js CSS

const LiveStreaming = ({ streamLink }) => {
  useEffect(() => {
    const player = videojs('player', {
      controls: true,
      autoplay: true,
      preload: 'none',
      responsive: true,
      fluid: true,
    });

    // Set up player
    player.ready(() => {
      player.src({ src: streamLink, type: 'application/x-mpegURL' });
      player.play().catch(error => {
        console.error('Error playing video:', error);
      });
    });

    // Cleanup on component unmount or streamLink change
    return () => {
      if (player) {
        player.pause(); // Pause video before disposing
        player.dispose();
      }
    };
  }, [streamLink]); // Dependency array ensures player updates when streamLink changes

  useEffect(() => console.log(streamLink), [streamLink]);

  return (
    <Center h="full">
      <Box w="50em">
        <video
          id="player"
          className="video-js vjs-default-skin"
          controls
          autoPlay
          preload="none"
        >
          <source
            src={streamLink}
            type="application/x-mpegURL"
          />
        </video>
      </Box>
    </Center>
  );
};

export default LiveStreaming;