import { createSelector } from 'reselect';
import { sectionTypes } from '../../../../../../common/constants';

const getSubmitState = state => state.metrics.isSubmitting;
const getIsCaptchaCheckedState = state => state.captcha.isCaptchaChecked;
const getInitialState = state => state.pageData.pageData.find(data => data.section === sectionTypes.HOME);

export default createSelector([
  getSubmitState,
  getIsCaptchaCheckedState,
  getInitialState,
], (isSubmitting, isCaptchaChecked, pageData) => ({
  isSubmitting,
  isCaptchaChecked,
  pageData,
}));
