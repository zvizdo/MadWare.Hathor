import React from 'react'

class PlayerControls extends React.Component {

  onNewPlaylist(e) {
    this.props.onNewPlaylistClick();
  }

  onRepeatSettingChange (e) {
    this.props.onRepeatChange(e.target.checked);
  }

  onShuffleSettingChange (e) {
    this.props.onShuffleChange(e.target.checked);
  }

  render() {
    return (
      <div class="row">
        <div class="col-md-12">
          <div class="bs-component">
            <div class="jumbotron">

                <a class="btn btn-primary btn-lg" onClick={this.onNewPlaylist.bind(this)} >
                  NEW PLAYLIST
                <div class="ripple-container"></div></a>

                <div class="checkbox">
                  <label>
                    <input type="checkbox" onChange={this.onRepeatSettingChange.bind(this)} />
                      <span style={{paddingLeft: "10px"}}>repeat</span>
                  </label>
                </div>
                <div class="checkbox">
                  <label>
                    <input type="checkbox" onChange={this.onShuffleSettingChange.bind(this)} />
                      <span style={{paddingLeft: "10px"}}>shuffle</span>
                  </label>
                </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

}

PlayerControls.propTypes = {
  onNewPlaylistClick: React.PropTypes.func,
  onRepeatChange: React.PropTypes.func,
  onShuffleChange: React.PropTypes.func
}

PlayerControls.defaultProps = {
  onNewPlaylistClick: () => {},
  onRepeatChange: () => {},
  onShuffleChange: () => {}
}

export default PlayerControls;
