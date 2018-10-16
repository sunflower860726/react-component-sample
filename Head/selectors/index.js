import { createSelector } from 'reselect';
import { sectionTypes } from '../../../../../../common/constants';

const getIsPageDataLoadedState = state => state.pageData.isPageDataLoaded;
const getInitialState = state => state.pageData.pageData.find(data => data.section === sectionTypes.SEO);

export default createSelector([
  getIsPageDataLoadedState,
  getInitialState,
], (isPageDataLoaded, pageData) => ({
  isPageDataLoaded,
  pageData,
}));
