import $ from 'jquery';
import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import { connect } from 'react-redux';
import { debounce, isEmpty } from 'lodash';
import ReCAPTCHA from 'react-google-recaptcha';

import selectors from './selectors';

import actions from '../../actions';
import { CAPTCHA_KEY } from '../../../../react/ClientApp/common';
import { FormError } from '../../../../react/common/components';
import { Modal } from '../../components';
import { eventOrigin, eventTypes } from '../../../../../common/constants';
import { rules } from '../../../../../common/validations';

const initialState = {
  submitIsClicked: false,
  applicationIsSent: false,
  errors: {},
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
};

class ApplicationModal extends React.Component {
  constructor() {
    super();

    this.state = {
      sessionId: localStorage.getItem('sessionId'),
      comingFromButton: false,
      ...initialState,
    };

    this.onModalClose = debounce(this.onModalClose.bind(this), 250);
    this.onModalShow = debounce(this.onModalShow.bind(this), 250);
    this.onSubmit = this.onSubmit.bind(this);
    this.sendOnSubmitEvent = debounce(this.sendOnSubmitEvent.bind(this), 250);
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
    this.onChange = this.onChange.bind(this);

    this.captcha = null;
  }

  componentDidMount() {
    const { id } = this.props;

    $(`#${id}`).on('hide.bs.modal', this.onModalClose);
    $(`#${id}`).on('show.bs.modal', this.onModalShow);
  }

  onChange(value) {
    const { setCaptcha } = this.props;

    if (value) {
      setCaptcha(true);
      this.onSubmit();
    }
  }

  onSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    const { isCaptchaChecked } = this.props;
    const { errors } = this.state;

    this.setState({ submitIsClicked: !!errors });

    if (!isCaptchaChecked) {
      this.captcha.execute();
    }

    if (isCaptchaChecked) {
      if (isEmpty(this.validate())) {
        this.sendOnSubmitEvent();
        this.setState({ comingFromButton: true });
      }
    }
  }

  onModalClose() {
    const { save } = this.props;
    const { sessionId, comingFromButton } = this.state;

    this.setState(initialState);

    if (!comingFromButton) {
      save({
        sessionId,
        origin: eventOrigin.APPLICATION,
        type: eventTypes.EXIT,
      });
    } else {
      this.setState({ comingFromButton: false });
    }
  }

  onModalShow() {
    const { save } = this.props;
    const { sessionId } = this.state;

    save({
      sessionId,
      origin: eventOrigin.APPLICATION,
      type: eventTypes.VIEW,
    });
  }

  sendOnSubmitEvent() {
    const { save } = this.props;
    const { sessionId } = this.state;

    save({
      sessionId,
      origin: eventOrigin.APPLICATION,
      type: eventTypes.LEAD,
    })
      .then(() => {
        this.setState({ applicationIsSent: true });
      });
  }

  handleChange({ target: { id, value } }) {
    this.setState({ [id]: value }, () => this.validate());
  }

  validate() {
    const { email, firstName, phoneNumber } = this.state;

    const errors = {};

    if (rules.isEmpty(email)) {
      errors.email = 'Please provide an Email adress';
    } else if (!rules.isValidEmail(email)) {
      errors.email = 'Email adress is invalid';
    }

    if (rules.isEmpty(firstName)) {
      errors.firstName = 'Please provide a First Name';
    } else if (!rules.isValidName(firstName)) {
      errors.firstName = 'First Name is invalid';
    }

    if (rules.isEmpty(phoneNumber)) {
      errors.phoneNumber = 'Please provide a Phone number';
    } else if (!rules.isPhoneNumber(phoneNumber)) {
      errors.phoneNumber = 'Phone number is invalid';
    }
    this.setState({ errors });
    return errors;
  }

  render() {
    const { id, isSubmitting, currentPlan, secondTitle, pageData } = this.props;
    const { errors, submitIsClicked, applicationIsSent } = this.state;

    const title = isEmpty(currentPlan) ? pageData.values.propertyName : currentPlan.description;

    const content = !applicationIsSent
      ? (
        <div className="modal-body">
          <div className="modal-heading">
            <h1 className="modal__title">{title}: {secondTitle}</h1>
            <span className="modal__subtitle">Please provide either an email or phone number</span>
          </div>
          <div className="sn-modal-body">
            <form onSubmit={this.onSubmit}>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label className="w-100 uppercase" htmlFor="firstName">
                      <input
                        type="text"
                        className="form-control mt-1"
                        id="firstName"
                        placeholder="First Name"
                        aria-describedby="First Name"
                        onChange={this.handleChange}
                      />
                      <FormError show={submitIsClicked} error={errors.firstName} />
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="w-100 uppercase" htmlFor="lastName">
                      <input
                        type="text"
                        className="form-control mt-1"
                        id="lastName"
                        placeholder="Last Name"
                        aria-describedby="Last Name"
                        onChange={this.handleChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label className="w-100 uppercase" htmlFor="phoneNumber">
                      <input
                        type="text"
                        className="form-control mt-1"
                        id="phoneNumber"
                        placeholder="Phone Number"
                        aria-describedby="Phone Number"
                        onChange={this.handleChange}
                      />
                      <FormError show={submitIsClicked} error={errors.phoneNumber} />
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="w-100 uppercase" htmlFor="email">
                      <input
                        type="text"
                        className="form-control mt-1"
                        id="email"
                        placeholder="Email"
                        aria-describedby="Email"
                        onChange={this.handleChange}
                      />
                      <FormError show={submitIsClicked} error={errors.email} />
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <ReCAPTCHA
                    ref={(el) => { this.captcha = el; }}
                    size="invisible"
                    sitekey={CAPTCHA_KEY}
                    onChange={this.onChange}
                    badge="inline"
                  />
                </div>
                <div className=" col-12 d-flex justify-content-center">
                  <input type="submit" disabled={isSubmitting} value="Save" className="button" />
                </div>
              </div>
            </form>
          </div>
        </div>
      )
      :
      (
        <div className="sn-success-container">
          <h1 className="modal__title text-center">
            <i className="fal fa-check-circle" />
            <span className="color-primary mb-4">Thank you {this.state.firstName}!</span>
            <span>We will contact you shortly</span>
          </h1>
        </div>
      );

    return (
      <Modal id={id}>
        <div className={cn('modal-content sn-modal-content', { 'sn-modal-content--light-brown': applicationIsSent })}>
          <div className="modal-header border-0 align-items-center justify-content-start">
            <button type="button" data-dismiss="modal" className="close align-self-baseline" aria-label="Close">
              <i className="fal fa-times" />
            </button>
          </div>
          {content}
        </div>
      </Modal>
    );
  }
}

ApplicationModal.defaultProps = {
  currentPlan: {},
  pageData: {},
  secondTitle: ' Schedule A Tour',
};

ApplicationModal.propTypes = {
  id: PropTypes.string.isRequired,
  save: PropTypes.func.isRequired,
  isCaptchaChecked: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  currentPlan: PropTypes.shape({}),
  pageData: PropTypes.shape({}),
  setCaptcha: PropTypes.func.isRequired,
  secondTitle: PropTypes.string,
};

export default connect(
  selectors,
  { ...actions.metrics,
    ...actions.captcha,
  },
)(ApplicationModal);
