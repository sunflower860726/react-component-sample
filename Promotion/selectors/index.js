import { createSelector } from 'reselect';
import { sectionTypes } from '../../../../../../common/constants';

const getIsPromotionsClickedState = state => state.promotionOffer.isPromotionsClicked;
const getInitialState = state => state.pageData.pageData.find(data => data.section === sectionTypes.PROMOTION);

export default createSelector([
  getIsPromotionsClickedState,
  getInitialState,
], (isPromotionsClicked, pageData) => ({
  isPromotionsClicked,
  pageData,
}));
