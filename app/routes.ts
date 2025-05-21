import {
  type RouteConfig,
  index,
  route,
  layout
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("infoprint", "routes/infoprint.tsx"),
  layout("routes/Protected.tsx", [
    route("main", "routes/main.tsx"),
    route("tester", "routes/tester.tsx"),
    route("presenter", "routes/presenter.tsx")
  ])
] satisfies RouteConfig;
