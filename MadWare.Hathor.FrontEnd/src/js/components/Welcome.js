import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';



class Welcome extends React.Component {

  constructor(){
    super();
    this.state = { serverId: "" };
  }

  handlePlayClick(){
    this.props.dispatch( push('/play') );
  }

  handleGoClick(){
    this.props.dispatch( push('/playlist/' + this.state.serverId) );
  }

  onPlaylistInputChange(e) {
    this.setState( { serverId: e.target.value } );
  }

  render() {

    return (
      <div class="row">
        <div class="col-md-12">

          <div class="bs-component">
            <div class="jumbotron">
              <a onClick={this.handlePlayClick.bind(this)} class="btn btn-primary btn-lg">PLAY<div class="ripple-container"></div></a>

              <p>...or...</p>

              <div class="row" >
                <div class="col-md-8">
                  <div class="form-group">
                    <input type="text"
                      class="form-control"
                      placeholder="...enter link to a playlist or just playlist id..."
                      value={this.state.serverId}
                      onChange={this.onPlaylistInputChange.bind(this)}/>
                  </div>
                </div>

                <div class="col-md-4">
                  <a onClick={this.handleGoClick.bind(this)} class="btn btn-primary btn-lg">GO<div class="ripple-container"></div></a>
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
  return state;
}

export default connect(mapStateToProps)(Welcome);
