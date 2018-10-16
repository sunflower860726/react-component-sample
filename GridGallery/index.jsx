import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import qs from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { HeroCarousel } from '../../Gallery/components';

class GridGallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHeroCarouselShown: !isEmpty(qs.parse(props.location.search)),
      heroCarouselImages: !isEmpty(qs.parse(props.location.search)) ? props.galleryData.values.images.filter(item => (qs.parse(props.location.search).filter === 'false') || item.category === qs.parse(props.location.search).filter) : [],
      activeImage: !isEmpty(qs.parse(props.location.search)) ? qs.parse(props.location.search).src : null,
    };

    this.renderImages = this.renderImages.bind(this);
    this.createHeroCarouselImages = this.createHeroCarouselImages.bind(this);
    this.closeHeroCarousel = this.closeHeroCarousel.bind(this);
    this.setFilter = this.setFilter.bind(this);
  }

  setFilter(src, filter) {
    this.props.history.push({
      pathname: '/gallery',
      search: `?src=${src}&filter=${filter}`,
    });
  }

  closeHeroCarousel() {
    const { isHeroCarouselShown } = this.state;

    if (!isHeroCarouselShown) {
      return;
    }

    this.setState({ isHeroCarouselShown: false });
  }

  createHeroCarouselImages(activeImage, filter) {
    const { galleryData } = this.props;
    this.setState({
      heroCarouselImages: galleryData.values.images.filter(item => !filter || item.category === filter),
      activeImage,
      isHeroCarouselShown: true,
    });
  }

  renderImages(filter = false) {
    const { isOnHomePage, galleryData } = this.props;

    let mappedImages;
    if (isOnHomePage) {
      mappedImages = (galleryData.values.images.filter(item => !filter || item.category === filter)).map((image, key) => (
        <figure key={key} className="gallery__item client-gallery" onClick={() => this.setFilter(image.src, filter)}>
          <div className="gallery__overlay">
            <span className="gallery__overlay__item">{image.title}</span>
            <span className="gallery__overlay__category">{image.category}</span>
          </div>
          <img src={image.src} alt={image.title} />
        </figure>
      ));
    } else {
      mappedImages = (galleryData.values.images.filter(item => !filter || item.category === filter)).map((image, key) => (
        <figure key={key} className="gallery__item client-gallery" onClick={() => this.createHeroCarouselImages(image.src, filter)}>
          <div className="gallery__overlay">
            <span className="gallery__overlay__item">{image.title}</span>
            <span className="gallery__overlay__category">{image.category}</span>
          </div>
          <img src={image.src} alt={image.title} />
        </figure>
      ));
    }
    return mappedImages;
  }

  render() {
    const { isOnHomePage, currentImage, galleryData } = this.props;
    const { heroCarouselImages, activeImage, isHeroCarouselShown } = this.state;

    const title = isOnHomePage ?
      (
        <div className="section-title mx-auto">
          <span>Gallery</span>
        </div>
      ) : null;

    const heroCarousel = isOnHomePage ?
      null :
      (
        <HeroCarousel show={isHeroCarouselShown} images={heroCarouselImages} activeImage={activeImage} onClose={this.closeHeroCarousel} currentImage={currentImage} />
      );

    const navItems = galleryData.values.imageCategories.map((item, key) =>
      (
        <a key={key} className="nav-item nav-link" id={`gallery-${item}-tab`} data-toggle="tab" href={`#gallery-${item}`} role="tab" aria-controls={`gallery-${item}`} aria-selected="false">{item}</a>
      ));

    const tabItems = galleryData.values.imageCategories.map((item, key) =>
      (
        <div key={key} className="tab-pane fade" id={`gallery-${item}`} role="tabpanel" aria-labelledby={`gallery-${item}-tab`}>
          <div className="gallery grid">
            {this.renderImages(item)}
          </div>
        </div>
      ));

    return (
      <section className="container-fluid gallery-section">
        {heroCarousel}
        <div className="row">
          <div className="col p-0 plans-container">
            {title}
            <nav className="sn-nav">
              <div className="nav floor-plans-tab-group" id="nav-tab" role="tablist">
                <a className="nav-item nav-link active" id="gallery-all-tab" data-toggle="tab" href="#gallery-all" role="tab" aria-controls="gallery-all" aria-selected="true">All</a>
                {navItems}
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div className="tab-pane fade show active" id="gallery-all" role="tabpanel" aria-labelledby="gallery-all-tab">
                <div className="gallery grid">
                  {this.renderImages()}
                </div>
              </div>
              {tabItems}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

GridGallery.defaultProps = {
  galleryData: {},
  isOnHomePage: false,
  currentImage: null,
};

GridGallery.propTypes = {
  galleryData: PropTypes.shape({
    values: PropTypes.shape({
      images: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
    }).isRequired,
  }),
  currentImage: PropTypes.number,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isOnHomePage: PropTypes.bool,
};

export default connect(() => ({}))(withRouter(GridGallery));
