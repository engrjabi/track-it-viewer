import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { fromEvent } from "file-selector";
import { withStyles } from "@material-ui/core/styles";
import Select from "react-select";
import { mainDashboardStyles } from "./mainDashboardStyles";
import { CardList } from "../../components/CardList/cardList";
import { addImageComparisonOnFilesForDisplay, filesGroupByDate, mergeMetaDataWithFilesForDisplay, shapeFilesForDisplay } from "./mainDashboardUtils";
import { sortByDate, sortByTime } from "../../utils/Formatters";
import { dateFormat } from "../../constants/date";

const MainDashBoard = ({ classes }) => {
  const [groupedFiles, setGroupedFiles] = useState([]);
  const [selectedDateGroup, setSelectedDateGroup] = useState({});
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [groupDateOptions, setGroupDateOptions] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState([]);

  const handleData = e => {
    if (e.type === "drop") {
      setLoadingFiles(true);
    }
    return fromEvent(e);
  };

  const onDrop = files => {
    const groupedFiles = filesGroupByDate(files);
    const groupDateOptions = Object.keys(groupedFiles).map(date => ({
      value: date,
      label: date
    }));
    const groupDateOptionsSorted = sortByDate(groupDateOptions, "value", dateFormat);

    setGroupedFiles(groupedFiles);
    setGroupDateOptions(groupDateOptionsSorted);
    setLoadingFiles(false);
  };

  return (
    <section>
      <div className={classes.dropZone}>
        <Dropzone disableClick disabled={loadingFiles} getDataTransferItems={handleData} onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => {
            return (
              <section>
                <div {...getRootProps()} className={classes.dropZoneContainer}>
                  <input {...getInputProps()} type="file" multiple directory="true" webkitdirectory="true" />
                  <p>Drop track-it folders here.</p>
                  <p>
                    <strong>OR</strong> click this and select the parent folder that contains all the track-it folders.
                  </p>
                </div>
              </section>
            );
          }}
        </Dropzone>
      </div>

      {groupDateOptions.length !== 0 && (
        <Select
          className={classes.mainDateSelector}
          value={selectedDateGroup.value}
          onChange={async selected => {
            const selectedGroup = groupedFiles[selected.value] || [];
            const formattedGroup = shapeFilesForDisplay(selectedGroup);
            const sortedGroup = sortByTime(formattedGroup, "title", "hh:mm A");
            const filesForDisplayWithMetaData = await mergeMetaDataWithFilesForDisplay(selectedGroup, sortedGroup);
            const filesForDisplayFinalShape = await addImageComparisonOnFilesForDisplay(filesForDisplayWithMetaData);

            setSelectedCollection(filesForDisplayFinalShape);
            setSelectedDateGroup(selectedGroup);
          }}
          options={groupDateOptions}
        />
      )}

      <CardList cardList={selectedCollection} />
    </section>
  );
};

export default withStyles(mainDashboardStyles)(MainDashBoard);
