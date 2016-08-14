import React, { PropTypes } from 'react';

const canPlayVideo = function(vidIndex, playlistLength) {
  return playlistLength > 0 &&
          vidIndex < playlistLength;
}

const isPlaylistEmpty = function(serverExists, playlistLength){
  return serverExists && playlistLength === 0;
}

const videoPropType = PropTypes.shape({
  id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  thumbnail: React.PropTypes.string.isRequired,
  secretId: React.PropTypes.string.isRequired,
  upVotes: React.PropTypes.array.isRequired
});

export {
  canPlayVideo,
  isPlaylistEmpty,
  videoPropType
}
