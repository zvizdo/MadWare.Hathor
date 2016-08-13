import React from 'react';
import { connect } from 'react-redux';

import YouTube from 'react-youtube';
import PlayerControls from './PlayerControls';
import AddToPlaylist from './../shared/AddToPlaylist';
import CurrentlyPlaying from './../shared/CurrentlyPlaying';
import Playlist from './../shared/Playlist';

import setupActions from './../../actions/setupActions';
import serverActions from './../../actions/serverActions';
import clientActions from './../../actions/clientActions';
import { generateRandomNumber, createSignature } from './../../utils/utils';

import { baseRemoteUrl } from './../../httpConfig';
import SignalRConnection from './../../utils/SignalRConnection';
import { canPlayVideo } from './../../utils/playlist';

class Server extends React.Component {

    constructor(){
      super();
      this.player = null;
      this.hub = new SignalRConnection(baseRemoteUrl);
      this.hub.setReceiveMessageCallback(this.onServerMessageRecieved.bind(this));
    }

    componentDidMount() {
      this.props.dispatch( setupActions.clearClient() );
      this.props.dispatch( setupActions.generateServerId() );

      this.hub.connect(function(){
          this.hub.registerServer(this.props.server.id);
        }.bind(this)
      );
    }

    componentWillUnmount() {
      this.hub.disconnect();
    }

    onServerMessageRecieved(action){
      console.log(this.props.playlist);
      this.props.dispatch(action);
      console.log(this.props.playlist);
      switch (action.type) {
        case "PLAYLIST_ADD_VIDEO":
        case "PLAYLIST_REMOVE_VIDEO":
          this.props.dispatch( serverActions.refreshPlaylist(this.props.server.id, this.props.playlist) );
          break;

        case "SERVER_CLIENT_REFRESH_REQUESTED":
          this.props.dispatch( serverActions.refreshPlaylist(this.props.server.id, this.props.playlist, action.payload) );
          break;
      }
    }

    _onReady(event) {
     this.player = event.target;
   }

   _onEnd(event) {

     if(this.props.playlist.shuffle) {
       let rnd = generateRandomNumber(0, this.props.playlist.videos.length);
       while (rnd === this.props.playlist.currentVideoIndex) {
         rnd = generateRandomNumber(0, this.props.playlist.videos.length);
       }

       this.props.dispatch( {type: "PLAYLIST_CHANGE_CURRENT_VIDEO", payload: rnd} );
     }
     else if (this.props.playlist.repeat &&
         this.props.playlist.videos.length === this.props.playlist.currentVideoIndex+1) {
           this.props.dispatch( {type: "PLAYLIST_CHANGE_CURRENT_VIDEO", payload: 0} );
      }
      else {
          this.props.dispatch( {type: "PLAYLIST_CHANGE_CURRENT_VIDEO", payload: this.props.playlist.currentVideoIndex+1} );
      }

     this.props.dispatch( serverActions.refreshPlaylist(this.props.server.id, this.props.playlist) );
   }

   _onError(event){
     console.log("VIDEO ERROR!!!");
     console.log(event);
   }

   getVideoToPlay(){
     if(this.props.playlist.currentVideoIndex === null ||
        this.props.playlist.videos.length == this.props.playlist.currentVideoIndex )
      return null;

     return this.props.playlist.videos[this.props.playlist.currentVideoIndex];
   }

   onRepeatSettingChange(repeatState){
     this.props.dispatch( { type: "PLAYLIST_REPEAT_ON_OFF", payload: repeatState } );
   }

   onShuffleSettingChange(shuffleState){
     this.props.dispatch( { type: "PLAYLIST_SHUFFLE_ON_OFF", payload: shuffleState } );
   }

   onAddVideoToPlaylist(videoId) {
     let secretId = createSignature( this.props.server.id+this.props.server.id, videoId );
     this.props.dispatch( clientActions.addVideo(this.props.server.id, videoId, secretId) );
   }

   onRemoveVideoPlaylist(videoId) {
     this.props.dispatch( { type: "PLAYLIST_REMOVE_VIDEO_SERVER", payload: videoId } );
     this.props.dispatch( serverActions.refreshPlaylist(this.props.server.id, this.props.playlist) );
   }

   componentDidUpdate(prevProps, prevState) {
     //when using chrome cast the player behaves weird
     //this is an ugly fix when video changes because autoplay doesn't work
     setTimeout( function(){
       if(this.player !== null &&
         (this.player.getPlayerState() === -1 ||
         this.player.getPlayerState() === 3 )) {
         this.player.playVideo();
       }
     }.bind(this), 3000 );
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
                  videoId={video === null ? null : video.id}
                  opts={opts}
                  onReady={this._onReady.bind(this)}
                  onEnd={this._onEnd.bind(this)}
                  onError={this._onError.bind(this)} />

              </div>
            </div>

          </div>

          <div class="col-md-4">

            <PlayerControls
               onRepeatChange={this.onRepeatSettingChange.bind(this)}
               onShuffleChange={this.onShuffleSettingChange.bind(this)} />

            <AddToPlaylist onVideoAdded={this.onAddVideoToPlaylist.bind(this)} />
          </div>
        </div>

        {canPlayVideo(this.props.playlist.currentVideoIndex, this.props.playlist.videos.length) ?
          (<CurrentlyPlaying video={this.props.playlist.videos[this.props.playlist.currentVideoIndex]} />) : null}

       <Playlist
          serverId={this.props.server.id}
          clientId={this.props.server.id}
          isServer={true}
          videos={this.props.playlist.videos}
          currentVideoIndex={this.props.playlist.currentVideoIndex}
          onPlaylistRemoveVideo={this.onRemoveVideoPlaylist.bind(this)} />

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
