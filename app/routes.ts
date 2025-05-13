import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("main", "routes/main.tsx"),
  route("tester", "routes/tester.tsx"),
  route("presenter", "routes/presenter.tsx"),
  route("infoprint", "routes/infoprint.tsx")
] satisfies RouteConfig;
