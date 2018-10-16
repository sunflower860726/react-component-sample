import { createSelector } from 'reselect';

const getIsGalleryArrowClicked = state => state.gallery.isGalleryArrowIsClicked;

export default createSelector([
  getIsGalleryArrowClicked,
], isGalleryArrowIsClicked => ({
  isGalleryArrowIsClicked,
}));
