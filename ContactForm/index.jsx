import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import React from 'react';
import cn from 'classnames';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import selectors from './selectors';

import { rules } from '../../../../../common/validations';
import actions from '../../../../react/ClientApp/actions';
import { CAPTCHA_KEY } from '../../../../react/ClientApp/common';
import { FormError, Spinner } from '../../../../react/common/components';
import { conversionTypes } from '../../../../../common/constants';
import { helpers } from '../../common/utils';

const initialState = {
  submitIsClicked: false,
  errors: {},
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
};

class ContactForm extends React.Component {
  constructor() {
    super();

    this.state = {
      ...initialState,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitFormData = this.submitFormData.bind(this);
    this.captcha = null;
  }

  onChange(value) {
    const { setCaptcha } = this.props;

    if (value) {
      setCaptcha(true);
      this.handleSubmit();
    }
  }

  validate() {
    const { email, firstName, phoneNumber } = this.state;

    const errors = {};

    if (rules.isEmpty(email) && rules.isEmpty(phoneNumber)) {
      errors.email = 'Please provide an Email adress or a Phone number';
    } else if (!rules.isEmpty(email)) {
      if (!rules.isValidEmail(email)) {
        errors.email = 'Email adress is invalid';
      }
    }

    if (rules.isEmpty(firstName)) {
      errors.firstName = 'Please provide a First Name';
    } else if (!rules.isValidName(firstName)) {
      errors.firstName = 'First Name is invalid';
    }

    if (rules.isEmpty(email) && rules.isEmpty(phoneNumber)) {
      errors.phoneNumber = 'Please provide an Email adress or a Phone number';
    } else if (!rules.isEmpty(phoneNumber)) {
      if (!rules.isPhoneNumber(phoneNumber)) {
        errors.phoneNumber = 'Phone number is invalid';
      }
    }

    this.setState({ errors });
    return errors;
  }

  handleChange({ target: { id, value } }) {
    this.setState({ [id]: value }, () => this.validate());
  }

  handleSubmit(event) {
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
        this.submitFormData();
      }
    }
  }

  submitFormData() {
    const { submit } = this.props;
    const { email, firstName, lastName, phoneNumber } = this.state;

    submit({ email, firstName, lastName, phoneNumber, conversionType: conversionTypes.APPLY_NOW })
      .then(() => this.setState({ ...initialState }));
  }

  render() {
    const { errors, submitIsClicked, firstName, lastName, email, phoneNumber } = this.state;
    const { bgGray, pageData, isPageDataLoaded, isSubmitting } = this.props;

    let content = <Spinner />;

    if (isPageDataLoaded) {
      content = (
        <section id="contact-form" className={cn('container-fluid', { 'bg-gray': bgGray })} style={helpers.renderBackground(pageData.values.applicationForm.image)}>
          <div className="section-title">
            <span>{pageData.values.applicationForm.title}</span>
          </div>
          <form onSubmit={this.handleSubmit}>
            <ReCAPTCHA
              ref={(el) => { this.captcha = el; }}
              size="invisible"
              sitekey={CAPTCHA_KEY}
              onChange={this.onChange}
            />
            <div className="row">
              <div className="offset-md-2 col-md-4">
                <div className="form-group">
                  <label className="w-100 uppercase" htmlFor="firstName">
                    <input type="text" placeholder="First Name" className="form-control mt-1" id="firstName" aria-describedby="firstName" value={firstName} onChange={this.handleChange} />
                    <FormError show={submitIsClicked} error={errors.firstName} />
                  </label>
                </div>
                <div className="form-group">
                  <label className="w-100 uppercase" htmlFor="lastName">
                    <input type="text" placeholder="Last Name" className="form-control mt-1" id="lastName" aria-describedby="lastName" value={lastName} onChange={this.handleChange} />
                  </label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="w-100 uppercase" htmlFor="email">
                    <input type="text" placeholder="Email" className="form-control mt-1" value={email} id="email" aria-describedby="email" onChange={this.handleChange} />
                    <FormError show={submitIsClicked} error={errors.email} />
                  </label>
                </div>
                <div className="form-group">
                  <label className="w-100 uppercase" htmlFor="phoneNumber">
                    <input type="text" placeholder="Phone" className="form-control mt-1" id="phoneNumber" aria-describedby="phoneNumber" value={phoneNumber} onChange={this.handleChange} />
                    <FormError show={submitIsClicked} error={errors.phoneNumber} />
                  </label>
                </div>
              </div>
              <div className="offset-md-2 col-md-8 d-flex justify-content-center">
                <button type="submit" disabled={isSubmitting} className="button">submit application</button>
              </div>
            </div>
          </form>
        </section>
      );
    }

    return (
      content
    );
  }
}
ContactForm.defaultProps = {
  bgGray: false,
  pageData: {},
};

ContactForm.propTypes = {
  setCaptcha: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  isCaptchaChecked: PropTypes.bool.isRequired,
  bgGray: PropTypes.bool,
  pageData: PropTypes.shape({}),
  isPageDataLoaded: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default connect(
  selectors,
  {
    ...actions.captcha,
    ...actions.conversions,
  },
)(ContactForm);
