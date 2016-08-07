import React from 'react'
import { connect } from 'react-redux'

import setupActions from './../../actions/setupActions';
import clientActions from './../../actions/clientActions';

import { baseRemoteUrl } from './../../httpConfig';
import SignalRConnection from './../../utils/SignalRConnection';

class Client extends React.Component {

  constructor(){
    super();
    this.state = { addedVideoId: "" };
    this.hub = new SignalRConnection(baseRemoteUrl);
    this.hub.setReceiveMessageCallback(this.onServerMessageRecieved.bind(this));
  }

  onVideoInputChange(e){
    this.setState( { addedVideoId: e.target.value } );
  }

  onAddVideoToPlaylist(){
    this.props.dispatch( clientActions.addVideo(this.props.client.serverId, this.state.addedVideoId) );
    this.setState( { addedVideoId: "" } );
  }

  componentDidMount() {
    this.props.dispatch( setupActions.clearServer() );
    this.props.dispatch( setupActions.setServerIdOnClient(this.props.params.serverId) );
    this.props.dispatch( setupActions.generateClientId() );

    this.hub.connect(function(){
        this.hub.registerClient(this.props.client.id, this.props.client.serverId);
      }.bind(this)
    );
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

  render() {

    return (
      <div>

        <div class="row" style={{display: this.props.client.serverExists ? "" : "none"}}>
          <div class="col-md-12">

            <div class="bs-component">
              <div class="jumbotron">

                <div class="row" >
                  <div class="col-md-8">
                    <div class="form-group">
                      <input type="text"
                        class="form-control"
                        placeholder="...enter YouTube video id..."
                        value={this.state.addedVideoId}
                        onChange={this.onVideoInputChange.bind(this)}/>
                    </div>
                  </div>

                  <div class="col-md-4">
                    <a onClick={this.onAddVideoToPlaylist.bind(this)} class="btn btn-primary btn-lg">
                      ADD TO PLAYLIST
                      <div class="ripple-container"></div>
                    </a>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>

        <div class="row">
          <div class="col-md-12">

            <div class="bs-component">
              <div class="jumbotron">

                <div class="bs-component">
                  <div class="list-group">

                    {!this.props.client.serverExists ?
                      (<p>Playlist with this id does not exist or was closed!</p>) : null}

                    {this.props.client.serverExists && this.props.playlist.videos.length === 0 ?
                    (<p>Playlist is currently empty!</p>)
                    : null}

                    {this.props.playlist.videos.length > 0 &&
                     this.props.playlist.currentVideoIndex < this.props.playlist.videos.length ?
                    (<div key={this.props.playlist.videos[this.props.playlist.currentVideoIndex].id} class="list-group-item">
                      <div class="row-picture">
                        <img class="circle" src={this.props.playlist.videos[this.props.playlist.currentVideoIndex].thumbnail} alt="icon"/>
                      </div>
                      <div class="row-content">
                        <h4 class="list-group-item-heading">Playing:</h4>
                        <p class="list-group-item-text">{this.props.playlist.videos[this.props.playlist.currentVideoIndex].title}</p>
                      </div>
                    </div>)
                    : null
                   }

                   <div class="list-group-separator"></div>

                    {this.props.playlist.videos.map( function(v){

                      return (
                        <div key={v.id} class="list-group-item">
                          <div class="row-picture">
                            <img class="circle" src={v.thumbnail} alt="icon"/>
                          </div>
                          <div class="row-content">
                            <p class="list-group-item-text">{v.title}</p>
                          </div>
                        </div>
                      );

                    } )}

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

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
