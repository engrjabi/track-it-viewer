export const mainDashboardStyles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 500,
    height: 450
  },
  subheader: {
    width: "100%"
  },
  mainDateSelector: {
    zIndex: 11,
    margin: 20
  },
  dropZone: {
    display: "block",
    margin: 20
  },
  dropZoneContainer: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    textAlign: "center",
    border: "2px dashed"
  }
});
