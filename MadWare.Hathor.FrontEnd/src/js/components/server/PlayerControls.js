import React from 'react'

class PlayerControls extends React.Component {

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
  onRepeatChange: React.PropTypes.func,
  onShuffleChange: React.PropTypes.func
}

PlayerControls.defaultProps = {
  onRepeatChange: () => {},
  onShuffleChange: () => {}
}

export default PlayerControls;
