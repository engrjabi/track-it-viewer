import _groupBy from "lodash/groupBy";
import { dateAndTimeSeparator, timeFormat } from "../../constants/date";
import moment from "moment";
import { readAsText } from "promise-file-reader";
import _isArray from "lodash/isArray";
import _get from "lodash/get";
import promisesAll from "promises-all";
import resemble from "resemblejs";
import { CLICKUP_TICKET_NUMBER_REGEX } from "../../utils/regex";
import _uniq from "lodash/uniq";
import _flattenDeep from "lodash/flattenDeep";

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

export const makeTicketNumberFilterOption = list => {
  const allTickets = list.map(card => _get(card, "ocrData", "").match(CLICKUP_TICKET_NUMBER_REGEX)).filter(card => card !== null);
  return _uniq(_flattenDeep(allTickets)).map(ticketNumber => ticketNumber.trim());
};
