import _groupBy from "lodash/groupBy";
import { dateAndTimeSeparator, timeFormat } from "../../constants/date";
import moment from "moment";
import { readAsText } from "promise-file-reader";
import _isArray from "lodash/isArray";
import _get from "lodash/get";
import _size from "lodash/size";
import { CLICKUP_TICKET_NUMBER_REGEX } from "../../utils/regex";
import _uniq from "lodash/uniq";
import _flattenDeep from "lodash/flattenDeep";
import _find from "lodash/find";
import _isEmpty from "lodash/isEmpty";
import { prettyFormatMinTime } from "../../utils/Formatters";
import { interpolateEmptyItems } from "../../utils/arrays";

export const filesGroupByDate = files =>
  _groupBy(files, file => {
    /**
     * Group by date.
     * file.path looks something like (archive/Jul-31-2019/Jul-31-2019--12:45_PM.jpg)
     * so we want to group by second directory only
     * @type {string[]}
     */
    const splitPaths = file.path.split("/");
    return splitPaths[1];
  });

export const shapeFilesForDisplay = imageCollection => {
  /**
   * We want only the files with dateAndTimeSeparator on file name since the expected file name will be
   * (Jul-31-2019--12:40_PM.jpg)
   * @type {Object[]}
   */
  return imageCollection
    .filter(file => file.name.includes(dateAndTimeSeparator))
    .map(fileImage => {
      const img = URL.createObjectURL(fileImage);
      // file.name looks like (Jul-31-2019--12:40_PM.jpg)
      const timeAsTitle = fileImage.name.split(dateAndTimeSeparator)[1];
      // By this point file.name should look like (12:40_PM.jpg)
      const timeAsTitleNoExt = timeAsTitle.split(".")[0];
      const timeAsTitleParsed = moment(timeAsTitleNoExt, timeFormat);
      const timeAsTitleFormatted = timeAsTitleParsed.format("hh:mm A");

      return {
        img,
        title: timeAsTitleFormatted,
        raw: fileImage
      };
    });
};

/**
 * Merge the metadata contents of the file that is inside the tract-it folders it contains different info about the active window captured
 * Info such as binary name, window title, process id, ocr data. Such data will be needed to display more meaningful data with the screen capture
 *
 * @param selectedGroupWithMetaData - All files. (All screen capture with the json file containing the metadata)
 * @param filesForDisplay
 * @return {Promise<*>}
 */
export const mergeMetaDataWithFilesForDisplay = async (selectedGroupWithMetaData, filesForDisplay) => {
  const metaFile = selectedGroupWithMetaData.find(file => file.type === "application/json");
  const metaFileString = await readAsText(metaFile);
  const metaFileParsed = metaFileString.split(/\r?\n/g).map(fileMeta => {
    try {
      return JSON.parse(fileMeta);
    } catch (e) {
      return fileMeta;
    }
  });

  return filesForDisplay.map(fileForDisplay => {
    const metaDataCollection =
      _isArray(metaFileParsed) &&
      metaFileParsed.find(metaData =>
        _get(metaData, "formattedDateTime", "")
          .replace("_", " ")
          .includes(fileForDisplay.title)
      );
    return {
      ...metaDataCollection,
      ...fileForDisplay
    };
  });
};

/**
 * Used to filter out images that the user is idle. File collection should already contains a metadata
 * about its comparison with the previous image
 *
 * @param filesForDisplay
 * @param timePerImageInMin
 */
export const getIdleTimeData = (filesForDisplay, timePerImageInMin = 2) => {
  const noIdleTimeFiles = filesForDisplay.filter(fileForDisplay => {
    const rawMisMatchPercentage = _get(fileForDisplay, "diffWithPrev.rawMisMatchPercentage", 100);
    return rawMisMatchPercentage > 3;
  });

  const totalUptime = _size(filesForDisplay) * timePerImageInMin;
  const totalWorkingTime = _size(noIdleTimeFiles) * timePerImageInMin;
  const totalIdleTime = totalUptime - totalWorkingTime;

  return {
    noIdleTimeFiles,
    totalIdleTime: prettyFormatMinTime(totalIdleTime),
    totalWorkingTime: prettyFormatMinTime(totalWorkingTime),
    totalUptime: prettyFormatMinTime(totalUptime)
  };
};

/**
 * Used to associate all images with corresponding tickets. No images shall be left out with no associated ticket to them.
 * interpolateEmptyItems is used in cases that the screen shot has no valuable ocr data with ticket number
 *
 * @param filesForDisplay - files for display, assumed to have ocr data already
 * @param clickUpTickets - data of tasks list from clickup api
 */
export const setTicketAssociation = (filesForDisplay, clickUpTickets) => {
  // const clickUpTicketIdsOnlyAssignedToMe = clickUpTickets.filter(ticket => _find(ticket.assignees, {username: 'Alexander Joshua Ignacio'})).map(ticket => ticket.id)
  const clickUpTicketIdsOnlyAssignedToMe = clickUpTickets.map(ticket => ticket.id);

  const allOcrTickets = filesForDisplay.map(card => {
    const ocrData = _get(card, "ocrData", "");
    return clickUpTicketIdsOnlyAssignedToMe.filter(clickUpId => ocrData.includes(clickUpId));
  });

  const allOcrTicketsInterpolated = interpolateEmptyItems(allOcrTickets, [], item => _isEmpty(item));

  return filesForDisplay.map((card, idx) => {
    return {
      ...card,
      relatedTicket: allOcrTicketsInterpolated[idx]
    };
  });
};

/**
 * Used to create a list of buttons of ticket number to be used as filters
 *
 * @param list - list of files in display
 * @param clickUpTickets - data of tasks list from clickup api
 */
export const makeTicketNumberFilterOption = (list, clickUpTickets) => {
  const allOcrTickets = list.map(card => card.relatedTicket);

  const allOcrTicketsFlatten = _flattenDeep(allOcrTickets).map(ticketNumber => ticketNumber.trim());
  const allOcrTicketsUniq = _uniq(allOcrTicketsFlatten.filter(ticketNumber => ticketNumber !== ""));

  return allOcrTicketsUniq.map(id => ({
    ..._find(clickUpTickets, { id }),
    imageCount: _size(allOcrTicketsFlatten.filter(ticketNumber => ticketNumber === id))
  }));
};
