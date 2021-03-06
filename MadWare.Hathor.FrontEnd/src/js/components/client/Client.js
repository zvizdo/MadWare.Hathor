import React from 'react'
import { connect } from 'react-redux'

import AddToPlaylist from './../shared/AddToPlaylist';
import CurrentlyPlaying from './../shared/CurrentlyPlaying';
import Playlist from './../shared/Playlist';

import setupActions from './../../actions/setupActions';
import clientActions from './../../actions/clientActions';

import { baseRemoteUrl } from './../../httpConfig';
import SignalRConnection from './../../utils/SignalRConnection';
import { canPlayVideo, getVideoIdx } from './../../utils/playlist';
import { createSignature } from './../../utils/utils';


class Client extends React.Component {

  constructor(){
    super();
    this.hub = new SignalRConnection(baseRemoteUrl);
    this.hub.setReceiveMessageCallback(this.onServerMessageRecieved.bind(this));
  }

  componentWillMount() {
    this.props.dispatch( setupActions.clearServer() );
    this.props.dispatch( setupActions.setServerIdOnClient(this.props.params.serverId) );
    this.props.dispatch( setupActions.generateClientId(this.hub, this.props.params.serverId) );
  }

  onVideoInputChange(e){
    this.setState( { addedVideoId: e.target.value } );
  }

  onAddVideoToPlaylist(videoId){
    let secretId = createSignature( this.props.client.serverId+this.props.client.id, videoId );
    this.props.dispatch( clientActions.addVideo(this.props.client.serverId, videoId, secretId) );
  }

  componentWillUnmount() {
    this.hub.disconnect();
  }

  onServerMessageRecieved(action){
    this.props.dispatch(action);

    switch (action.type) {
      case "CLIENT_REGISTER_WITH_SERVER":
        if(action.payload)
          this.props.dispatch( clientActions.refreshPlaylist(this.props.params.serverId, this.props.client.id) );
        break;

    }
  }

  onRemoveVideoPlaylist(videoId) {
    let action = {
      type: "PLAYLIST_REMOVE_VIDEO",
      payload: { videoId: videoId, serverId: this.props.client.serverId, clientId: this.props.client.id }
    }
    this.props.dispatch( clientActions.pushToServer( this.props.client.serverId, this.props.client.id, action ) );
  }

  onUpVoteVideoPlaylist(videoId) {
    let action = {
      type: "PLAYLIST_UPVOTE_VIDEO",
      payload: { videoId: videoId, serverId: this.props.client.serverId, clientId: this.props.client.id }
    }
    this.props.dispatch( clientActions.pushToServer( this.props.client.serverId, this.props.client.id, action ) );
  }

  getVideoToPlay() {
    if (!this.props.playlist.currentVideoId)
     return null;

    let crntVidIdx = getVideoIdx(this.props.playlist.currentVideoId, this.props.playlist.videos);
    if( crntVidIdx === null || crntVidIdx >= this.props.playlist.videos.length)
     return null;

    return this.props.playlist.videos[crntVidIdx];
  }

  render() {
    let video = this.getVideoToPlay();

    return (
      <div>

        {this.props.client.serverExists ?
          (<AddToPlaylist onVideoAdded={this.onAddVideoToPlaylist.bind(this)} />) : null}

          {video ?
            (<CurrentlyPlaying video={video} />) : null}

       <Playlist
         serverId={this.props.client.serverId}
         clientId={this.props.client.id}
         serverExists={this.props.client.serverExists}
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
    client: state.client,
    playlist: state.playlist
  };
}

export default connect(mapStateToProps)(Client);
