import React from 'react'

import parseYouTubeLink from './../../utils/youTubeParser';

class AddToPlaylist extends React.Component {

  constructor(){
    super();
    this.state = {
      addedVideo: "",
      parseError: false
   };
  }

  onVideoLinkTextChange(e) {
    this.setState( { addedVideo: e.target.value, parseError: false } );
  }

  onAddVideoToPlaylist(){
    let ytVideoId = parseYouTubeLink(this.state.addedVideo);
    if (ytVideoId){
      this.props.onVideoAdded(ytVideoId);
      this.setState( { addedVideo: "" } );
    } else {
      this.setState( { parseError: true } );
    }
  }

  render() {
    return (
      <div class="row">
        <div class="col-md-12">

          <div class="bs-component">
            <div class="jumbotron">

              <div class="row" >
                <div class="col-md-8">
                  <div class={"form-group" + (this.state.parseError ? " has-error" : "")}>

                    {this.state.parseError ?
                    (<label class="control-label" for="inputError">Incorrect link added</label>) : null}

                    <input type="text"
                      class="form-control"
                      placeholder="...enter YouTube link..."
                      value={this.state.addedVideo}
                      onChange={this.onVideoLinkTextChange.bind(this)}/>
                  </div>
                </div>

                <div class="col-md-4">
                  <a onClick={this.onAddVideoToPlaylist.bind(this)} class="btn btn-primary btn-lg">
                    ADD
                    <div class="ripple-container"></div>
                  </a>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }

}

AddToPlaylist.propTypes = {
  onVideoAdded: React.PropTypes.func.isRequired
}

export default AddToPlaylist
