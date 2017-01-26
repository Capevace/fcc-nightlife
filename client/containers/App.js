import React from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import { Container } from '../components/Grid';
import Loader from '../components/Loader';

function App({ children, loading }) {
  return (
    <div>
      <Header />
      <Container className="mt-4">
        {loading
          ? <Loader loading />
          : children
        }
      </Container>
      <Container className="mt-3">
        Made by Lukas von Mateffy (
          <a href="https://twitter.com/Capevace">@Capevace</a>&nbsp;|&nbsp;
          <a href="http://smoolabs.com">smoolabs.com</a>&nbsp;|&nbsp;
          <a href="https://github.com/Capevace">GitHub</a>
        ) &nbsp; - &nbsp;
        Uses the Yelp-API.
      </Container>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading > 0
  };
};

export default connect(mapStateToProps)(App);
