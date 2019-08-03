import _groupBy from "lodash/groupBy";
import { dateAndTimeSeparator, timeFormat } from "../../constants/date";
import moment from "moment";

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

export const formatImageFiles = imageCollection => {
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
        title: timeAsTitleFormatted
      };
    });
};
