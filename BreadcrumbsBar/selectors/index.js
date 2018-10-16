import { createSelector } from 'reselect';
import { sectionTypes } from '../../../../../../common/constants';

const getIsPageDataLoadedState = state => state.pageData.isPageDataLoaded;
const getFloorPlansState = state => state.pageData.pageData.find(data => data.section === sectionTypes.FLOOR_PLANS);
const getHomeState = state => state.pageData.pageData.find(data => data.section === sectionTypes.HOME);

export default createSelector([
  getIsPageDataLoadedState,
  getFloorPlansState,
  getHomeState,
], (isPageDataLoaded, floorPlansData, homeData) => ({
  isPageDataLoaded,
  floorPlansData,
  homeData,
}));
