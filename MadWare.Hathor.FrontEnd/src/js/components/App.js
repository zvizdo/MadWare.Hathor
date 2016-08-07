import React from 'react'
import { connect } from 'react-redux'

class App extends React.Component {

  render() {

    return (
      <div class="container">


        <div class="row">
          <div class="col-md-12">

            <div class="page-header">
              <h1 id="container">Hathor</h1>
            </div>

          </div>
        </div>

        {this.props.children}
      </div>
    );
  }

}

function mapStateToProps(state){
  return state;
}

export default connect(mapStateToProps)(App);
