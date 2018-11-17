import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import { styles } from './styles';
import { preventDefaultEvent } from '../../utils/browserCommands';

class CardList extends Component {

	handleCardRedirect = (tile) => {
		console.log('handle click');
	};

	render() {
		const { classes, cardList } = this.props;

		return (
			<div className={classes.root}>
				<GridList className={classes.gridList}>
					{cardList.map((tile, indexId, tileCollection) => {
						const doesImgExists = (tile && tile.hasOwnProperty('img'));

						const currentGroup = tile.group;
						const prevGroup = tileCollection[indexId - 1] && tileCollection[indexId - 1].group;

						const renderComponent = [
							(<GridListTile className={classes.gridListTile}>
								<ButtonBase
									focusRipple
									className={classes.buttonWrapper}
									onClick={() => this.handleCardRedirect(tile)}
									focusVisibleClassName={classes.focusVisible}>

									<div
										className={`${classes.avatarWrapper} ${doesImgExists ? classes.avatarWrapperHoverEffect : ''}`}>
										<Avatar aria-label="default-icon" className={classes.avatar}>
											{tile.title.substring(0, 2).toUpperCase()}
										</Avatar>
									</div>

									{doesImgExists &&
									<img
										src={tile.img}
										onDragStart={preventDefaultEvent}
										className={classes.image}
										alt={tile.title}
									/>}

									<GridListTileBar
										title={tile.title}
										style={{ textAlign: 'left' }}
										subtitle={
											<span>
                      {/*<FavoriteIcon/> {tile.launched}*/}
                    </span>
										}
									/>
								</ButtonBase>
							</GridListTile>)
						];

						if (prevGroup !== currentGroup) {
							renderComponent.unshift(
								<GridListTile style={{
									width: '100%',
								}}>
									<h2>{currentGroup}</h2>
								</GridListTile>);
						}

						return renderComponent;
					})}
				</GridList>
			</div>
		);
	}
}

CardList.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CardList);
