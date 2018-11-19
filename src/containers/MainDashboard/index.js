import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions as mainDashBoardActions } from '../../ducks/mainDashBoard';
import {
	mainDashBoardSingleSelector,
	makeGetVeryDeepStateAndGreetings,
	makeGetVeryDeepState,
} from '../../ducks/selectors/mainDashBoard';
import Dropzone from 'react-dropzone'
import { fromEvent } from 'file-selector';
import { withStyles } from '@material-ui/core/styles';
import CardList from '../../components/CardList';
import { sortAlphabetically } from '../../utils/Formatters';
import Select from 'react-select';
import moment from 'moment';
import './style.css';

const styles = theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
		backgroundColor: theme.palette.background.paper,
	},
	gridList: {
		width: 500,
		height: 450,
	},
	subheader: {
		width: '100%',
	},
	mainDateSelector: {
		zIndex: 11,
		display: 'inline-block',
		margin: 20,
		width: '50%',
	},
	dropZone: {
		display: 'inline-block',
		margin: 20,
	},
	dropZoneContainer: {
		padding: 10,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: 180,
		textAlign: 'center',
	}
});

class MainDashBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			files: [],
			selectedGroup: {},
			groupDateOptions: [],
			loadingFiles: false,
		}
	}

	componentDidMount() {
		const { toggleGreetings, toggleNestedState } = this.props;
		toggleGreetings('hello', 'world', 'hi');
		toggleNestedState('foo', 'bar', 'bar');
	}

	handleChangeOfDateFilter = (selectedGroup) => {
		this.setState({ selectedGroup });
	};

	onDrop = (files) => {
		let groupDateOptions = [];
		const formattedFiles = files.sort(sortAlphabetically('path'))
			.reduce((accumulator, file) => {
				const splitPaths = file.path.split('/');
				const date = splitPaths[1];
				const img = URL.createObjectURL(file);
				const title = file.name.split('.')[0];
				const titleFormatted = moment(title, 'HH:mm').format('hh:mm A');

				if (accumulator[date]) {
					accumulator[date].push({
						img,
						title: titleFormatted,
					})
				} else {
					groupDateOptions.push({
						value: date,
						label: date,
					});
					accumulator[date] = [{
						img,
						title: titleFormatted,
					}];
				}

				return accumulator;
			}, {});
		console.log('end', formattedFiles, groupDateOptions);
		this.setState({
			files: formattedFiles,
			groupDateOptions,
			loadingFiles: false,
		})
	};

	handleData = (e) => {
		if (e.type === 'drop') this.setState({ loadingFiles: true });
		return fromEvent(e);
	};

	render() {
		const { classes } = this.props;
		const { files, selectedGroup, loadingFiles, groupDateOptions } = this.state;

		return (
			<section>
				<div className={classes.dropZone}>
					<Dropzone
						disableClick
						disabled={loadingFiles}
						getDataTransferItems={this.handleData}
						onDrop={this.onDrop}
					>
						<div className={classes.dropZoneContainer}>
							<p>Drop a folder with files here.</p>
						</div>

					</Dropzone>
				</div>

				{groupDateOptions.length !== 0 &&
				<Select
					style={{
						zIndex: 11,
					}}
					className={classes.mainDateSelector}
					value={selectedGroup}
					onChange={this.handleChangeOfDateFilter}
					options={groupDateOptions}
				/>}

				<CardList
					cardList={files[selectedGroup.value] || []}
				/>
			</section>
		)
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MainDashBoard));
