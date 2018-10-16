import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import { connect } from 'react-redux';
import { goToAnchor, configureAnchors } from 'react-scrollable-anchor';
import { isEmpty } from 'lodash';
import { withRouter } from 'react-router-dom';

import selectors from './selectors';

import { paths } from '../../../../../common/constants';
import actions from '../../actions';

class Promotion extends React.Component {
  constructor() {
    super();

    this.closeExclusiveOffer = this.closeExclusiveOffer.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  componentDidMount() {
    configureAnchors({ offset: -141 });
  }

  componentWillUnmount() {
    const { setClickedStateOff } = this.props;

    setClickedStateOff();
  }

  onButtonClick(id) {
    const { location: { pathname }, history: { push }, saveClick, offerIsClickedOn } = this.props;

    saveClick(id);

    if (pathname === paths.client.FLOOR_PLANS) {
      goToAnchor('anchor-scroll');
    } else {
      push(paths.client.FLOOR_PLANS);
      offerIsClickedOn();
    }
  }

  closeExclusiveOffer() {
    const { hidePromotionsBar } = this.props;
    hidePromotionsBar();
  }

  render() {
    const { isPromotionsClicked, pageData, isStatic } = this.props;

    const closeButton = isStatic
      ? null
      : (
        <button className="close-offer-button" onClick={this.closeExclusiveOffer}><i className="fal fa-times" aria-hidden="true" /></button>
      );

    const style = isStatic ?
      {
        backgroundImage: `url("${pageData.values.image}")`,
      }
      : null;

    const content = isEmpty(pageData)
      ? null
      : (
        <section id="promotion" style={style} className={cn('container-fluid', { animate: isPromotionsClicked, static: isStatic })}>
          {closeButton}
          <div className="row h-100 align-items-center flex-1">
            <div className="offset-md-2 col-md-8 exclusive-offer__column">
              <div className="exlusive-offer__content">
                <span className="exclusive-offer__title">Exclusive Offer:</span>
                <p className="exclusive-offer__text" dangerouslySetInnerHTML={{ __html: pageData.values.promotionHTML }} />
              </div>
              <button className="button ml-sm-2 mt-4 mt-md-0" onClick={() => this.onButtonClick(pageData.values._id)}>Select A Unit</button>
            </div>
          </div>
        </section>
      );

    return (content);
  }
}
Promotion.defaultProps = {
  pageData: {},
  isStatic: false,
};

Promotion.propTypes = {
  isPromotionsClicked: PropTypes.bool.isRequired,
  hidePromotionsBar: PropTypes.func.isRequired,
  setClickedStateOff: PropTypes.func.isRequired,
  offerIsClickedOn: PropTypes.func.isRequired,
  pageData: PropTypes.shape({}),
  saveClick: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  isStatic: PropTypes.bool,
};

export default connect(
  selectors,
  {
    ...actions.promotionOffer,
  },
)(withRouter(Promotion));
