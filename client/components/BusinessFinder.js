import React from 'react';

import { Row, Col } from './Grid';
import BusinessListContainer from '../containers/BusinessListContainer';

class BusinessFinder extends React.Component {
  constructor(props) {
    super(props);

    this.onLocationInputChange = this.onLocationInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      locationInput: '',
      locationQuery: ''
    };
  }

  onLocationInputChange(event) {
    this.setState({ locationInput: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();

    this.setState({ locationQuery: this.state.locationInput });
  }

  render() {
    return (
      <div>
        <form className="w-100 mb-4" onSubmit={this.onSubmit}>
          <div className="card">
            <Row className="card-block">
              <Col xs={8}>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter your location"
                  value={this.state.locationInput}
                  onChange={this.onLocationInputChange}
                  autoFocus />
              </Col>
              <Col xs={4}>
                <button className="btn btn-primary btn-block">Find Locations</button>
              </Col>
            </Row>
          </div>
        </form>
        <BusinessListContainer location={this.state.locationQuery} />
      </div>
    );
  }
}

export default BusinessFinder;
