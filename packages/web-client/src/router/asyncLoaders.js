import Loader from "../components/LoadingComponent";

export const AsyncMainDashBoard = Loader({
  loader: () => import("../containers/MainDashboard/mainDashboard")
});

export const AsyncNotFoundPage = Loader({
  loader: () => import("../containers/NotFoundPage")
});
