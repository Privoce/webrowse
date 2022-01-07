import ReactDOM from 'react-dom';
import GraphQL from '../common/GraphQL'

import Container from './components/Container';
ReactDOM.render(
  <GraphQL>
    <Container />
  </GraphQL>,
  document.getElementById('container'));
