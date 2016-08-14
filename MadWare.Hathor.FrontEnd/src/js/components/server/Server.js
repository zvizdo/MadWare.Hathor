import React from 'react';
import { connect } from 'react-redux';

import YouTube from 'react-youtube';
import PlayerControls from './PlayerControls';
import AddToPlaylist from './../shared/AddToPlaylist';
import CurrentlyPlaying from './../shared/CurrentlyPlaying';
import Playlist from './../shared/Playlist';

import setupActions from './../../actions/setupActions';
import serverActions from './../../actions/serverActions';
import { generateRandomNumber, createSignature } from './../../utils/utils';

import { baseRemoteUrl } from './../../httpConfig';
import SignalRConnection from './../../utils/SignalRConnection';
import { canPlayVideo, getVideoIdx, playlistMngr } from './../../utils/playlist';

class Server extends React.Component {

    constructor(){
      super();
      this.player = null;
      this.hub = new SignalRConnection(baseRemoteUrl);
      this.hub.setReceiveMessageCallback(this.onServerMessageRecieved.bind(this));
    }

    _onReady(event) {
     this.player = event.target;
   }

    componentWillMount() {
      this.props.dispatch( setupActions.clearClient() );
      this.props.dispatch( setupActions.generateServerId(this.hub) );
      this.props.dispatch( serverActions.restorePlaylistLocal() );
    }

    componentWillUnmount() {
      this.hub.disconnect();
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.player &&
          this.props.playlist.currentVideoId &&
          this.player.getPlayerState() !== 1 &&
          prevProps.playlist.currentVideoId === this.props.playlist.currentVideoId) {
        this.player.playVideo();
      }

      //when using chrome cast the player behaves weird
      //this is an ugly fix when video changes because autoplay doesn't work
      setTimeout( function(){
        if(this.player &&
          (this.player.getPlayerState() === -1 ||
          this.player.getPlayerState() === 3 )) {
          this.player.playVideo();
        }
      }.bind(this), 3000 );
    }

    onServerMessageRecieved(action){
      this.props.dispatch( serverActions.handleReceiveMessage(action, this.props) );
    }

   onVideoEnd(event) {
     const prevVideoId = this.props.playlist.currentVideoId;
     this.props.dispatch( { type: "PLAYLIST_CHANGE_VIDEO_PLAYED", payload: { videoId: prevVideoId, wasPlayed: true } } );

     playlistMngr.updatePlaylist(this.props.playlist);
     let nextVideoId = playlistMngr.chooseNextVideo( function(act) {
       switch (act) {
         case "ALL_PLAYED":
           this.props.dispatch( { type: "PLAYLIST_RESET_VIDEOS_PLAYED" } );
           break;
       }
     }.bind(this) );

     playlistMngr.playlist.currentVideoId = nextVideoId;

     this.props.dispatch( { type: "PLAYLIST_CHANGE_CURRENT_VIDEO", payload: nextVideoId } );
     this.props.dispatch( serverActions.refreshPlaylist(this.props.server.id, playlistMngr.playlist) );
     serverActions.storePlaylistLocal(playlistMngr.playlist);
   }

   _onError(event){
     console.log("VIDEO ERROR!!!");
     console.log(event);
   }

   getVideoToPlay() {
     if (!this.props.playlist.currentVideoId)
      return null;

     let crntVidIdx = getVideoIdx(this.props.playlist.currentVideoId, this.props.playlist.videos);
     if( crntVidIdx === null || crntVidIdx >= this.props.playlist.videos.length)
      return null;

     return this.props.playlist.videos[crntVidIdx];
   }

   onNewPlaylistRequested() {
     this.props.dispatch( setupActions.generateServerId(this.hub, true) );
     this.props.dispatch( { type: "PLAYLIST_CHANGE_VIDEOS", payload: [] } );
     this.props.dispatch( { type: "PLAYLIST_CHANGE_CURRENT_VIDEO", payload: null } );
   }

   onCleanPlayedClick() {
     this.props.dispatch( { type: "PLAYLIST_RESET_VIDEOS_PLAYED" } );
   }

   onRepeatSettingChange(repeatState) {
     this.props.dispatch( { type: "PLAYLIST_REPEAT_ON_OFF", payload: repeatState } );
     serverActions.storePlaylistLocal( { ...this.props.playlist, repeat: repeatState } );

     if (this.props.playlist.videos.length > 0 && this.getVideoToPlay() == null){
       this.props.playlist.repeat = repeatState;
       this.onVideoEnd(this.player);
     }
   }

   onShuffleSettingChange(shuffleState){
     this.props.dispatch( { type: "PLAYLIST_SHUFFLE_ON_OFF", payload: shuffleState } );
     serverActions.storePlaylistLocal( { ...this.props.playlist, shuffle: shuffleState } );

     if (this.props.playlist.videos.length > 0 && this.getVideoToPlay() == null) {
       this.props.playlist.shuffle = shuffleState;
       this.onVideoEnd(this.player);
     }
   }

   onAddVideoToPlaylist(videoId) {
     let secretId = createSignature( this.props.server.id+this.props.server.id, videoId );
     this.props.dispatch( serverActions.addVideoServer(this.props.server.id, videoId, secretId) );
   }

   onRemoveVideoPlaylist(videoId) {
     this.props.dispatch( serverActions.removeVideoServer( videoId, this.props ) );
   }

   onUpVoteVideoPlaylist(videoId) {
     this.props.dispatch( serverActions.upVoteVideo(
       { videoId: videoId, serverId: this.props.server.id, clientId: this.props.server.id },
       this.props ) );
   }

  render() {

    const opts = {
      height: '390',
      width: '100%',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

    let video = this.getVideoToPlay();

    return (
      <div>

        <div class="row">
          <div class="col-md-8">

            <div class="bs-component">
              <div class="jumbotron">

                <p>Share playlist id: <strong>{this.props.server.id}</strong></p>

                <YouTube
                  id="ytVideoPlayer"
                  videoId={!video ? null : video.id}
                  opts={opts}
                  onReady={this._onReady.bind(this)}
                  onEnd={this.onVideoEnd.bind(this)}
                  onError={this._onError.bind(this)} />

              </div>
            </div>

          </div>

          <div class="col-md-4">

            <PlayerControls
               repeat={this.props.playlist.repeat}
               shuffle={this.props.playlist.shuffle}
               onNewPlaylistClick={this.onNewPlaylistRequested.bind(this)}
               onCleanPlayedClick={this.onCleanPlayedClick.bind(this)}
               onRepeatChange={this.onRepeatSettingChange.bind(this)}
               onShuffleChange={this.onShuffleSettingChange.bind(this)} />

            <AddToPlaylist onVideoAdded={this.onAddVideoToPlaylist.bind(this)} />
          </div>
        </div>

        {video ?
          (<CurrentlyPlaying video={video} />) : null}

       <Playlist
          serverId={this.props.server.id}
          clientId={this.props.server.id}
          isServer={true}
          videos={this.props.playlist.videos}
          currentVideoId={this.props.playlist.currentVideoId}
          onPlaylistRemoveVideo={this.onRemoveVideoPlaylist.bind(this)}
          onPlaylistUpVoteVideo={this.onUpVoteVideoPlaylist.bind(this)} />

      </div>
    );
  }

}

function mapStateToProps(state){
  return {
    server: state.server,
    playlist: state.playlist
  };
}

export default connect(mapStateToProps)(Server);
