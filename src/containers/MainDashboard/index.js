import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions as mainDashBoardActions } from '../../ducks/mainDashBoard';
import {
	mainDashBoardSingleSelector,
	makeGetVeryDeepStateAndGreetings,
	makeGetVeryDeepState,
} from '../../ducks/selectors/mainDashBoard';
import './style.css';

class MainDashBoard extends Component {
	componentDidMount() {
		const { toggleGreetings, toggleNestedState } = this.props;
		toggleGreetings('hello', 'world', 'hi');
		toggleNestedState('foo', 'bar', 'bar');
	}

	render() {
		const { veryDeepStateAndGreetings, greetings, veryDeepState } = this.props;
		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<div className="App-intro">
					Redux State Connected:
					<p><strong>greetings:</strong> {greetings}</p>
					<p><strong>veryDeepState:</strong> {veryDeepState}</p>
					<p><strong>veryDeepStateAndGreetings:</strong> {veryDeepStateAndGreetings}</p>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	veryDeepStateAndGreetings: makeGetVeryDeepStateAndGreetings(state),
	greetings: mainDashBoardSingleSelector.makeGetGreetings(state),
	veryDeepState: makeGetVeryDeepState(state),
});

const mapDispatchToProps = {
	toggleGreetings: mainDashBoardActions.toggleGreetings,
	toggleNestedState: mainDashBoardActions.toggleNestedState,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainDashBoard);
