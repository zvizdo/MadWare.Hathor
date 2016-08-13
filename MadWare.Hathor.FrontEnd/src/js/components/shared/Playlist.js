import React from 'react'

import { canPlayVideo, isPlaylistEmpty, videoPropType } from './../../utils/playlist';
import { createSignature } from './../../utils/utils';

class Playlist extends React.Component {

  onRemoveVideo(videoId){
    this.props.onPlaylistRemoveVideo(videoId);
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
                      <div key={v.id} class={"list-group-item" + (i===this.props.currentVideoIndex ? " playing" : "")}>
                        <div class="row-picture">
                          <img class="circle" src={v.thumbnail} alt="icon"/>
                        </div>
                        <div class="row-content">
                          <p class="list-group-item-text">{v.title}</p>

                          {sig === v.secretId || this.props.isServer ?
                            (<i style={{cursor: "pointer"}} class="material-icons" onClick={this.onRemoveVideo.bind(this, v.id)}>clear</i>) : null}

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
  currentVideoIndex: React.PropTypes.number,
  onPlaylistRemoveVideo: React.PropTypes.func.isRequired,
  isServer: React.PropTypes.bool
}

Playlist.defaultProps = {
  serverId: "",
  clientId: "",
  serverExists: true,
  currentVideoIndex: 0,
  isServer: false
}

export default Playlist;
