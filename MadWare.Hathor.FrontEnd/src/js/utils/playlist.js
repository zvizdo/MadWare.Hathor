import React, { PropTypes } from 'react';
import { generateRandomNumber } from './utils';

const canPlayVideo = function(vidIndex, playlistLength) {
  if (!vidIndex)
    return false;

  return playlistLength > 0 &&
          vidIndex < playlistLength;
}

const isPlaylistEmpty = function(serverExists, playlistLength){
  return serverExists && playlistLength === 0;
}

const getVideoIdx = function(videoId, videos) {
  for (let i = 0; i < videos.length; i++){
    if (videoId === videos[i].id)
      return i;
  }

  return null;
}

const getVideoIdByIdx = function(vIdx, videos) {
  if (vIdx >= videos.length)
    return null;

  return videos[vIdx].id;
}

const videoPropType = PropTypes.shape({
  id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  thumbnail: React.PropTypes.string.isRequired,
  secretId: React.PropTypes.string.isRequired,
  upVotes: React.PropTypes.array.isRequired
});

class PlaylistManager {

  constructor() {
    this.playlist = null;
  }

  updatePlaylist(playlist) {
    this.playlist = {...playlist, videos: [...playlist.videos.map( (v,i) => { return {...v} } )]};
  }

  videosToPlay() {
    return this.playlist.videos
               .map( (v, i) => {
                 return { videoIndex: i, video: v, weight: 1.0 + v.upVotes.length }
               } )
               .filter( v => {
                  return !v.video.wasPlayed;
               } )
               .sort( (x, y) => {
                 if( x.weight > y.weight ) return 1;
                 if( x.weight < y.weight ) return -1;
                 return 0;
               } );
  }

  _sumWeights(videos) {
      let sum = 0;
      for ( let i = 0; i < videos.length; i++ )
        sum += videos[i].weight;

      return sum;
  }

  setAllVideosAsNotPlayed() {
    return this.playlist.videos.map( (v, i) => {
      v.wasPlayed = false;
      return v;
    } );
  }

  chooseNextVideoWithProba(videos) {
    let sum = 0;
    let sumW = this._sumWeights(videos);
    let rnd = generateRandomNumber(0, sumW-1);

    let i = 0;
    while ( sum < rnd ) {
      sum += videos[i].weight;
      i += 1;
    }

    return videos[Math.max(0, i-1)].video.id;
  }

  chooseNextVideo(listenerFunc) {
    const playlistLength = this.playlist.videos.length;
    const { currentVideoId, repeat, shuffle } = this.playlist;
    let currentVideoIndex = getVideoIdx(currentVideoId, this.playlist.videos);

    try {
      this.playlist.videos[currentVideoIndex].wasPlayed = true;
    }catch(e) {}

    if (currentVideoIndex == null)
      currentVideoIndex = playlistLength;

    let videos = this.videosToPlay();
    let wereAllPlayed = videos.length === 0;

    if (!repeat && !shuffle) {
      return getVideoIdByIdx( Math.min( currentVideoIndex + 1, playlistLength ), this.playlist.videos);
    }
    else if ( repeat && !shuffle ) {
      if (currentVideoIndex+1 >= playlistLength) {
        listenerFunc("ALL_PLAYED");
        this.setAllVideosAsNotPlayed();
        return this.playlist.videos[0].id;
      }
      else
        return getVideoIdByIdx( Math.min( currentVideoIndex + 1, playlistLength ), this.playlist.videos);
    }
    else if ( !repeat && shuffle ){
      if (wereAllPlayed)
        return null;
      else
        return this.chooseNextVideoWithProba(videos);
    }
    else if ( repeat && shuffle ) {
      if (wereAllPlayed) {
        listenerFunc("ALL_PLAYED");
        this.setAllVideosAsNotPlayed();
        videos = this.videosToPlay();
        return this.chooseNextVideoWithProba(videos);
      }
      else
        return this.chooseNextVideoWithProba(videos);
    }

  }

}

const playlistMngr = new PlaylistManager();

export {
  canPlayVideo,
  getVideoIdx,
  getVideoIdByIdx,
  isPlaylistEmpty,
  videoPropType,
  playlistMngr
}
