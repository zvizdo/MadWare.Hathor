import React from 'react';

import { videoPropType } from './../../utils/playlist';

class CurrentlyPlaying extends React.Component {

  render() {
    return (
      <div class="row">
        <div class="col-md-12">

          <div class="bs-component">
            <div class="jumbotron">

              <div class="bs-component">
                <div class="list-group">

                <div key={this.props.video.id} class="list-group-item">
                  <div class="row-picture">
                    <img class="circle" src={this.props.video.thumbnail} alt="icon"/>
                  </div>
                  <div class="row-content">
                    <h4 class="list-group-item-heading">Playing:</h4>
                    <p class="list-group-item-text">{this.props.video.title}</p>
                  </div>
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

CurrentlyPlaying.propTypes  = {
  video: videoPropType.isRequired
}

export default CurrentlyPlaying;
