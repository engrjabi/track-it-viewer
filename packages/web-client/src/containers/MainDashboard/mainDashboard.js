import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { fromEvent } from "file-selector";
import { withStyles } from "@material-ui/core/styles";
import Select from "react-select";
import { mainDashboardStyles } from "./mainDashboardStyles";
import { CardList } from "../../components/CardList/cardList";
import {
  filesGroupByDate,
  getIdleTimeData,
  makeTicketNumberFilterOption,
  mergeMetaDataWithFilesForDisplay,
  setTicketAssociation,
  shapeFilesForDisplay
} from "./mainDashboardUtils";
import { prettyFormatMinTime, sortByDate, sortByTime } from "../../utils/Formatters";
import { dateFormat } from "../../constants/date";
import TextField from "@material-ui/core/TextField";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _find from "lodash/find";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";

const MainDashBoard = ({ classes }) => {
  const [groupedFiles, setGroupedFiles] = useState([]);
  const [selectedDateGroup, setSelectedDateGroup] = useState({});
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [groupDateOptions, setGroupDateOptions] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState([]);
  const [filteredSelectedCollection, setFilteredSelectedCollection] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [clickUpTickets, setClickUpTickets] = useState([]);
  const [idleTimeStatsDisplay, setIdleTimeStatsDisplay] = useState("");

  useEffect(() => {
    (async () => {
      const response = await axios.get("/api/tasks");
      setClickUpTickets(_get(response, "data.tasks", []));
    })();
  }, []);

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
      {/*TODO: Move to separate component*/}
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

      {!_isEmpty(idleTimeStatsDisplay) && <div className="text-center">{idleTimeStatsDisplay}</div>}

      {/*TODO: Move to separate component*/}
      {groupDateOptions.length !== 0 && (
        <Select
          className={classes.mainDateSelector}
          value={selectedDateGroup}
          onChange={async selected => {
            const selectedGroup = groupedFiles[selected.value] || [];
            const formattedGroup = shapeFilesForDisplay(selectedGroup);
            const sortedGroup = sortByTime(formattedGroup, "title", "hh:mm A");
            const filesForDisplayWithMetaData = await mergeMetaDataWithFilesForDisplay(selectedGroup, sortedGroup);
            const idleTimeData = getIdleTimeData(filesForDisplayWithMetaData);
            const filesWithTicketAssociation = setTicketAssociation(idleTimeData.noIdleTimeFiles, clickUpTickets);
            setIdleTimeStatsDisplay(`Working(${idleTimeData.totalWorkingTime}) Idle(${idleTimeData.totalIdleTime})`);

            setSelectedCollection(filesWithTicketAssociation);
            setFilteredSelectedCollection(filesWithTicketAssociation);
            setSelectedDateGroup(selected);
          }}
          options={groupDateOptions}
        />
      )}

      {/*TODO: Move to separate component*/}
      {!_isEmpty(filteredSelectedCollection) && (
        <div className="d-flex flex-wrap justify-content-center align-items-center">
          {makeTicketNumberFilterOption(filteredSelectedCollection, clickUpTickets).map(ticketDetails => {
            const ticketNumber = ticketDetails.id;
            const prettyFormattedTime = prettyFormatMinTime(ticketDetails.imageCount * 2);
            const assignedToMe = _find(ticketDetails.assignees, { username: "Alexander Joshua Ignacio" });

            return (
              <Tooltip disableFocusListener disableTouchListener title={ticketDetails.name} className="m-3" key={ticketNumber}>
                <Badge
                  color="primary"
                  badgeContent={prettyFormattedTime}
                  classes={{
                    badge: classes.badgeFilter
                  }}
                >
                  <Button
                    color={assignedToMe ? "primary" : "default"}
                    variant="contained"
                    onClick={() => {
                      setSearchWord(ticketNumber);
                      const filtered = selectedCollection.filter(item => {
                        const relatedTicket = _get(item, "relatedTicket", []);
                        return relatedTicket.includes(ticketNumber);
                      });
                      setFilteredSelectedCollection(filtered);
                    }}
                    key={ticketNumber}
                  >
                    {ticketNumber}
                  </Button>
                </Badge>
              </Tooltip>
            );
          })}
        </div>
      )}

      {/*TODO: Move to separate component*/}
      {selectedDateGroup.value && (
        <div className="w-100">
          <TextField
            className="w-100"
            label="Search"
            value={searchWord}
            variant="filled"
            onChange={e => setSearchWord(e.target.value)}
            onKeyPress={e => {
              const keycode = e.keyCode || e.which;
              if (keycode === 13) {
                const filtered = selectedCollection.filter(item => {
                  const OCR = _get(item, "ocrData", "");
                  const formattedDateTime = _get(item, "formattedDateTime", "");
                  return OCR.includes(searchWord) || formattedDateTime.includes(searchWord);
                });
                setFilteredSelectedCollection(filtered);
              }
            }}
          />
        </div>
      )}

      <CardList cardList={filteredSelectedCollection} />
    </section>
  );
};

export default withStyles(mainDashboardStyles)(MainDashBoard);
