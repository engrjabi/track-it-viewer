import Loader from "../components/LoadingComponent";

export const AsyncMainDashBoard = Loader({
  loader: () => import("../containers/MainDashboard")
});

export const AsyncNotFoundPage = Loader({
  loader: () => import("../containers/NotFoundPage")
});
