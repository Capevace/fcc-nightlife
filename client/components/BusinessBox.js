import React from 'react';

import { Row, Col } from './Grid';

class BusinessBox extends React.Component {
  constructor(props) {
    super(props);

    this.toggleAttendance = this.toggleAttendance.bind(this);

    this.state = {
      attending: props.business.userIsAttending
    };
  }

  componentWillReceiveProps(props) {
    if (this.props !== props) {
      this.setState({ attending: props.business.userIsAttending });
    }
  }

  toggleAttendance() {
    const newAttendance = !this.state.attending;
    this.setState({ attending: newAttendance });

    if (this.props.onChangeAttendance)
      this.props.onChangeAttendance(newAttendance, this.props.business.id);
  }

  render() {
    const { business, isLoggedIn } = this.props;
    const { attending } = this.state;

    return (
      <div className="card">
        <div className="card-block">
          <Row className="mb-3">
            <Col xs={!!business.image ? 9 : 12}>
              <div className="mb-2">
                <h5><a href={business.url}>{business.name}</a></h5>
              </div>

              {!!business.snippet &&
                  <blockquote className="blockquote mb-3">
                    <p className="mb-0" style={{ fontSize: '14px' }}>
                      "{business.snippet}"
                    </p>
                  </blockquote>
              }
            </Col>

            {!!business.image &&
              <Col xs={3}>
                <img
                  src={business.image}
                  className="w-100 rounded" />
              </Col>
            }
          </Row>

          <div className="d-flex justify-content-center w-100">
            <h5 className="mr-2 mb-0">
              <span className={`badge badge-${business.open ? 'success' : 'default'}`}>
                Open
              </span>
            </h5>
            <h5 className="mr-2 mb-0">
              <span className="badge badge-default">
                {business.attendeeCount + (attending ? 1 : 0)} attending
              </span>
            </h5>

            {isLoggedIn &&
              <button
                onClick={this.toggleAttendance}
                className={`
                  align-self-start
                  btn btn-sm
                  btn-attend
                  ${attending ? 'btn-success' : ''}
                  btn-block
                  mb-0`}>
                {attending ? '✓ Attending' : 'Attend'}
              </button>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default BusinessBox;
