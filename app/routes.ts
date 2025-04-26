import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("main", "routes/main.tsx"),
  route("present", "routes/present.tsx")
] satisfies RouteConfig;
