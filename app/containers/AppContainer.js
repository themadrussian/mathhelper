//React & React-Native libs
import React, { Component } from 'react';
import ReactNative from 'react-native';
const { View } = ReactNative;

//Redux libs
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// My actions
import { ActionCreators } from '../actions';

// Containers
import InsideContainer from './InsideContainer';

// Define top level Container
class AppContainer extends Component {
  componentWillMount(){
    // create the problem first
    this.props.createProblem();
  }

  render() {
    return (
      <View>
        <InsideContainer {...this.props}/>
      </View>
    )
  }
}

//this function makes action functions available for the entire app
function mapDispatchToProps(dispatch) {
 return bindActionCreators(ActionCreators, dispatch);
};

// and now connect it all together. plus, create an empty state object.
//                       empty state object,     map actions for app
export default connect((state) => {return {} }, mapDispatchToProps)(AppContainer);
