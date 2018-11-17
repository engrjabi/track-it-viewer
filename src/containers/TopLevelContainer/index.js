import React from 'react';
import ErrorBoundary from '../../components/connectedComponents/ErrorBoundary';
import Footer from '../../components/connectedComponents/Footer';
import Header from '../../components/connectedComponents/Header';
import { connect } from 'react-redux';
import './style.css';

class TopLevelContainer extends React.Component {
	static defaultProps = {};

	render() {
		return (
			<div className={`app`}>
				<Header/>
				<ErrorBoundary>
					<div className='main-content'>
						{this.props.children}
					</div>
				</ErrorBoundary>
				<Footer/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TopLevelContainer);
