import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ButtonBase from "@material-ui/core/ButtonBase";
import { preventDefaultEvent } from "../../utils/browserCommands";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { cardListStyles } from "./cardListStyles";
import _get from "lodash/get";

const CardListWithHoc = ({ classes, cardList }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoToShow, setPhotoToShow] = useState(null);

  const handleCardClick = indexId => () => {
    setIsOpen(true);
    setPhotoToShow(indexId);
  };

  return (
    <div className={classes.root}>
      {isOpen && (
        <Lightbox
          imageCaption={
            <div className="m-0">
              <p className="m-0">{_get(cardList, `${photoToShow}.title`)}</p>
              <p className="m-0">{_get(cardList, `${photoToShow}.activeWindowName`)}</p>
              <p className="m-0">{_get(cardList, `${photoToShow}.activeWindowDetails[0].bin`)}</p>
            </div>
          }
          mainSrc={cardList[photoToShow].img}
          nextSrc={cardList[(photoToShow + 1) % cardList.length].img}
          prevSrc={cardList[(photoToShow + cardList.length - 1) % cardList.length].img}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoToShow((photoToShow + cardList.length - 1) % cardList.length)}
          onMoveNextRequest={() => setPhotoToShow((photoToShow + 1) % cardList.length)}
        />
      )}

      <GridList className={classes.gridList}>
        {cardList.map((tile, indexId, tileCollection) => {
          const doesImgExists = tile && tile.hasOwnProperty("img");

          const currentGroup = tile.group;
          const prevGroup = tileCollection[indexId - 1] && tileCollection[indexId - 1].group;

          const renderComponent = [
            <GridListTile className={classes.gridListTile}>
              <ButtonBase
                focusRipple
                className={classes.buttonWrapper}
                onClick={handleCardClick(indexId)}
                focusVisibleClassName={classes.focusVisible}
              >
                <div className={`${classes.avatarWrapper} ${doesImgExists ? classes.avatarWrapperHoverEffect : ""}`}>
                  <div className={classes.avatar}>{tile.activeWindowName || "No Window Name"}</div>
                </div>

                {doesImgExists && <img src={tile.img} onDragStart={preventDefaultEvent} className={classes.image} alt={tile.title} />}

                <GridListTileBar title={tile.title} style={{ textAlign: "left" }} subtitle={<span>{/*<FavoriteIcon/> {tile.launched}*/}</span>} />
              </ButtonBase>
            </GridListTile>
          ];

          if (prevGroup !== currentGroup) {
            renderComponent.unshift(
              <GridListTile
                style={{
                  width: "100%"
                }}
              >
                <h2>{currentGroup}</h2>
              </GridListTile>
            );
          }

          return renderComponent;
        })}
      </GridList>
    </div>
  );
};

export const CardList = withStyles(cardListStyles)(CardListWithHoc);
