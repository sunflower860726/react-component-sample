import { createSelector } from 'reselect';
import { sectionTypes } from '../../../../../../common/constants';

const getIsCaptchaCheckedState = state => state.captcha.isCaptchaChecked;
const getIsPageDataLoadedState = state => state.pageData.isPageDataLoaded;
const getContactState = state => state.pageData.pageData.find(data => data.section === sectionTypes.HOME);
const getIsSubmittingState = state => state.conversions.isSubmitting;

export default createSelector([
  getIsCaptchaCheckedState, getIsPageDataLoadedState, getContactState, getIsSubmittingState,
], (isCaptchaChecked, isPageDataLoaded, pageData, isSubmitting) => ({
  isCaptchaChecked,
  isPageDataLoaded,
  pageData,
  isSubmitting,
}));
