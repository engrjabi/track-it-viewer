import React, { Component } from 'react';
import { connect } from 'react-redux';


class MainMenu extends Component {
	static defaultProps = {};

	render() {
		return (
			<div className={`main-navbar`}>
				Here is the navbar
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);

