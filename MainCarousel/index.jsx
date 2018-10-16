import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import $ from 'jquery';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import selectors from './selectors';

import { ApplicationModal } from '../../components';
import actions from '../../actions';

const applicationModalId = 'MainCarouselApplicationModal';

class MainCarousel extends React.Component {
  constructor() {
    super();

    this.state = {
      isApplicationModalShown: false,
    };

    this.showApplicationModal = this.showApplicationModal.bind(this);
  }

  componentWillUnmount() {
    const { setGalleryArrowIsClicked, isGalleryArrowIsClicked } = this.props;

    if (isGalleryArrowIsClicked) {
      setGalleryArrowIsClicked(false);
    }
  }

  showApplicationModal() {
    this.setState(
      { isApplicationModalShown: true },
      () => { $(`#${applicationModalId}`).modal('show'); },
    );
  }

  render() {
    const { isApplicationModalShown } = this.state;
    const { data, images, sizeContain, id, squareIndicators, hideIndicators, onClick, setGalleryArrowIsClicked, isGalleryArrowIsClicked } = this.props;

    const applicationModal = isApplicationModalShown ? <ApplicationModal id={applicationModalId} /> : null;

    const controls = !hideIndicators
      ? (
        <React.Fragment>
          <a className="carousel-control-prev" href={`#${id}`} role="button" data-slide="prev" onClick={() => setGalleryArrowIsClicked(true)}>
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="sr-only">Previous</span>
          </a>
          <a className="carousel-control-next" href={`#${id}`} role="button" data-slide="next" onClick={() => setGalleryArrowIsClicked(true)}>
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="sr-only">Next</span>
          </a>
        </React.Fragment>
      )
      : null;

    const content = !hideIndicators
      ? (
        <React.Fragment>
          <div className="offset-md-2 col-md-8 p- hero-content-wrapper">
            <div className={cn('hero-content', { 'hide-hero-content': isGalleryArrowIsClicked })}>
              <div className="hero-content__text-wrapper">
                <h1 className="hero-content__title" dangerouslySetInnerHTML={{ __html: data.mainTitle.replace(/\n/g, '<br/>') }} />
                <span className="hero-content__subtitle" dangerouslySetInnerHTML={{ __html: data.subTitle.replace(/\n/g, '<br/>') }} />
              </div>
              <button className=" button button--big hero-content__button" dangerouslySetInnerHTML={{ __html: data.buttonText }} onClick={this.showApplicationModal} />
            </div>
          </div>
          {applicationModal}
        </React.Fragment>
      )
      : null;

    const Indicators = () => {
      if (images.length <= 1) {
        return null;
      }

      return images.map((indicator, key) => (
        <li key={key} data-target={`#${id}`} data-slide-to={key} className={cn({ active: key === 0, indicator: squareIndicators })} />
      ));
    };

    const items = images.map((image, key) => {
      const style = {
        backgroundImage: `url(${image.src})`,
      };

      return (
        <div key={key} style={style} className={cn('carousel-item', { active: key === 0, 'size-contain': sizeContain })} onClick={onClick} />
      );
    });

    return (
      <div id={id} className={cn('carousel slide')} data-ride="carousel" data-interval="9999">
        {content}
        <ol className="carousel-indicators">
          <Indicators />
        </ol>
        <div className="carousel-inner">
          {items}
        </div>
        {controls}
      </div>
    );
  }
}

MainCarousel.defaultProps = {
  hideIndicators: false,
  squareIndicators: false,
  onClick: null,
  data: null,
  sizeContain: null,
};

MainCarousel.propTypes = {
  hideIndicators: PropTypes.bool,
  squareIndicators: PropTypes.bool,
  id: PropTypes.string.isRequired,
  data: PropTypes.PropTypes.shape({}),
  images: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onClick: PropTypes.func,
  sizeContain: PropTypes.bool,
  setGalleryArrowIsClicked: PropTypes.func.isRequired,
  isGalleryArrowIsClicked: PropTypes.bool.isRequired,
};

export default connect(
  selectors,
  {
    ...actions.gallery,
  },
)(withRouter(MainCarousel));
