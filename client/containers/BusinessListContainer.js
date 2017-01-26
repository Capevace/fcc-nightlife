import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { Row, Col } from '../components/Grid';
import BusinessBox from '../components/BusinessBox';
import Loader from '../components/Loader';

class BusinessListContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      businesses: []
    };

    this.cancelBusinessFetch = null;
    this.updateAttendance = this.updateAttendance.bind(this);
  }

  fetchBusinesses(location) {
    if (!location)
      return false;

    this.setState({ loading: true });

    axios
      .get(`/api/find/${location}`, {
        cancelToken: new axios.CancelToken((cancelFunction) => {
          this.cancelBusinessFetch = () => {
            this.cancelBusinessFetch = null;
            cancelFunction();
          };
        })
      })
      .then(result => this.setState({
        loading: false,
        error: false,
        businesses: result.data.businesses
      }))
      .catch(error => {
        if (!axios.isCancel(error)) {
          console.error(error);
          this.setState({
            loading: false,
            error: true,
            businesses: []
          });
        }
      });
  }

  updateAttendance(newAttendance, businessId) {
    axios
      .post(`/api/${newAttendance ? 'attend' : 'unattend'}/${businessId}`)
      .then(result => console.info('Successfully updated attendance.'))
      .catch(error => {
        console.error('Error during update of attendance', error);
      });
  }

  componentDidMount() {
    this.fetchBusinesses(this.props.location);
  }

  componentWillUnmount() {
    if (this.cancelBusinessFetch)
      this.cancelBusinessFetch();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.location !== this.props.location) {
      this.fetchBusinesses(newProps.location);
    }
  }

  render () {
    return this.state.loading
      ? <Loader loading />
      : this.state.error || !this.state.businesses
        ? <div>'Error'</div>
        : <Row>
            {this.state.businesses.map((business, index) =>
              <Col xs={12} sm={12} lg={4} className="mb-4" key={index}>
                <BusinessBox
                  business={business}
                  isLoggedIn={this.props.isLoggedIn}
                  onChangeAttendance={this.updateAttendance} />
              </Col>
            )}
          </Row>;
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn
  };
};

export default connect(mapStateToProps)(BusinessListContainer);
