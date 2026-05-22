import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  index("routes/home.tsx"),
  route("books", "routes/books.tsx"),
  route("calendar", "routes/calendar.tsx"),
] satisfies RouteConfig;
