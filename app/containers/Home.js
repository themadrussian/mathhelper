import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactNative from 'react-native';
const {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Picker
} = ReactNative;
import _ from 'underscore';
import styles from '../css/stylesHome';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected1: this.props.seed,
    }
  }

  problemSolved() {
    this.props.problemSolved();
    this.nextScreen();
  }

  problemNotSolved() {
    this.props.problemNotSolved();
    this.nextScreen();
  }

  nextScreen() {
    this.props.showReward();
    this.props.createProblem();
  }

  render() {
    var myAnswers = [];

    if (this.props.answerInput) {
      // true, 3 Choice answers
      this.props.answers.forEach( (answer, id) => {
        myAnswers.push(
          <TouchableHighlight
            key={id}
            style={styles.answer_button}
            underlayColor={ answer.correct ? "green" : "orange" }
            onPress={ answer.correct ? () => this.problemSolved() : () => this.problemNotSolved() }
          >
            <Text style={styles.text}>{answer.value}</Text>
          </TouchableHighlight>
        );
      })
    } else {
      // false, Rolldown
      var pickerItems = [];

      for (var i = 1; i <= this.props.seed*2; i++) {
        pickerItems.push(<Picker.Item label={i.toString()} value={i.toString()} key={i.toString()} />);
      };

      myAnswers.push(
        <View key="mainview" style={styles.pickerBigView}>
          <Picker style={styles.picker}
            itemStyle={styles.itemStyle}
            key="rrr"
            selectedValue={this.state.selected1.toString()}
            onValueChange={(selected1) => this.setState({selected1})}
          >
            {pickerItems}
          </Picker>
          <TouchableOpacity
            key="ok"
            style={styles.pickerOkButton}
            // underlayColor={ answer.correct ? "green" : "orange" }
            onPress={ _.findWhere(this.props.answers, {correct: true}).value == this.state.selected1 ? () => this.problemSolved() : () => this.problemNotSolved() }
          >
            <Text style={styles.pickerOkButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.field}>
        <View style={styles.formula}>
          <Text style={styles.text}>
            {this.props.problem.members[0]}
            &nbsp;
            {this.props.problem.operation[0]}
            &nbsp;
            {this.props.problem.members[1]}
          </Text>
        </View>
        <View style={styles.answers}>
            {myAnswers}
        </View>
      </View>
    )
  }
};

function mapStateToProps(state){
  return {
    problem: state.problem,
    answers: state.answers,
    seed: state.seed,
    answerInput: state.answerInput,
  }
};

export default connect(mapStateToProps)(Home);
