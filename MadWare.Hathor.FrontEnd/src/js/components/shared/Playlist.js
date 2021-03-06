import React from 'react'

import { canPlayVideo, isPlaylistEmpty, videoPropType } from './../../utils/playlist';
import { createSignature } from './../../utils/utils';

class Playlist extends React.Component {

  onRemoveVideo(videoId) {
    this.props.onPlaylistRemoveVideo(videoId);
  }

  onUpVoteVideo(videoId) {
    this.props.onPlaylistUpVoteVideo(videoId);
  }

  render() {
    return (
      <div class="row">
        <div class="col-md-12">

          <div class="bs-component">
            <div class="jumbotron">

              <div class="bs-component">
                <div class="list-group">

                  {!this.props.serverExists ?
                    (<p>Playlist with this id does not exist or was closed!</p>) : null}

                  {isPlaylistEmpty(this.props.serverExists, this.props.videos.length) ?
                    (<p>Playlist is currently empty!</p>) : null}

                  {this.props.videos.map( function(v,i) {
                    let sig = createSignature( this.props.serverId+this.props.clientId, v.id );
                    return (
                      <div key={v.id} class={"list-group-item" + (v.id === this.props.currentVideoId ? " playing" : "")}>
                        <div class="row-picture">
                          <img class="circle" src={v.thumbnail} alt="icon"/>
                        </div>
                        <div class="row-content">
                          <p class="list-group-item-text">{v.title}</p>

                          {sig !== v.secretId && !v.upVotes.find( vote => vote == sig ) ?
                            (<span class="upvotes">{v.upVotes.length}
                             <i style={{cursor: "pointer"}} class="material-icons" onClick={this.onUpVoteVideo.bind(this, v.id)}>favorite</i>
                            </span>) :
                            (<span class="upvotes">{v.upVotes.length}
                             <i class="material-icons">grade</i>
                            </span>)}

                          { v.id !== this.props.currentVideoId && (sig === v.secretId || this.props.isServer) ?
                            (<i style={{cursor: "pointer"}} class="material-icons" onClick={this.onRemoveVideo.bind(this, v.id)}>clear</i>) : null}

                          {v.wasPlayed ?
                            (<i style={{float: "right"}} class="material-icons">check box</i>) : null}

                        </div>
                      </div>
                    );

                  }.bind(this) )}

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }

}

Playlist.propTypes  = {
  serverId: React.PropTypes.string,
  clientId: React.PropTypes.string,
  serverExists: React.PropTypes.bool,
  videos: React.PropTypes.arrayOf(videoPropType).isRequired,
  currentVideoId: React.PropTypes.string,
  onPlaylistRemoveVideo: React.PropTypes.func.isRequired,
  onPlaylistUpVoteVideo: React.PropTypes.func.isRequired,
  isServer: React.PropTypes.bool
}

Playlist.defaultProps = {
  serverId: "",
  clientId: "",
  serverExists: true,
  currentVideoId: null,
  isServer: false
}

export default Playlist;
