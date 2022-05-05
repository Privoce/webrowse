import ReactDOM from "react-dom/client";
import GraphQL from "../common/GraphQL";

import Container from "./components/Container";
const root = ReactDOM.createRoot(document.getElementById("container"));
root.render(
  <GraphQL>
    <Container />
  </GraphQL>
);
