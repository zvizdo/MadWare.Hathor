import React, { PropTypes } from 'react';
import { generateRandomNumber } from './utils';

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
    let rnd = generateRandomNumber(0, this._sumWeights(videos)-1);

    let i = 0;
    while ( sum < rnd ) {
      sum += videos[i].weight;
      i += 1;
    }

    return videos[i].videoIndex;
  }

  chooseNextVideo(listenerFunc) {
    const playlistLength = this.playlist.videos.length;
    const { currentVideoIndex, repeat, shuffle } = this.playlist;

    try {
      this.playlist.videos[currentVideoIndex].wasPlayed = true;
    }catch(e) {}

    let videos = this.videosToPlay();
    let wereAllPlayed = videos.length === 0;

    if (!repeat && !shuffle) {
      return Math.min( currentVideoIndex + 1, playlistLength );
    }
    else if ( repeat && !shuffle ) {
      if (currentVideoIndex+1 >= playlistLength) {
        listenerFunc("ALL_PLAYED");
        this.setAllVideosAsNotPlayed();
        return 0;
      }
      else
        return Math.min( currentVideoIndex + 1, playlistLength );
    }
    else if ( !repeat && shuffle ){
      if (wereAllPlayed)
        return playlistLength;
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
  isPlaylistEmpty,
  videoPropType,
  playlistMngr
}
