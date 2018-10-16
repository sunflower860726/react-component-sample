import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import WebFont from 'webfontloader';
import { isEmpty } from 'lodash';

import selectors from './selectors';

class Head extends React.Component {
  static hexToRGB(hex) {
    let parseString = hex;
    if (hex.startsWith('#')) { parseString = hex.slice(1, 7); }
    if (parseString.length !== 6) { return null; }
    const r = parseInt(parseString.slice(0, 2), 16);
    const g = parseInt(parseString.slice(2, 4), 16);
    const b = parseInt(parseString.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) { return null; }
    return `${r}, ${g}, ${b}`;
  }

  static populateArray(headingFont, bodyFont, quoteFont, modalSubtitle) {
    const array = [];
    if (!isEmpty(bodyFont)) {
      array.push(`${bodyFont}:300,400,400i,600,700`);
    }
    if (!isEmpty(headingFont)) {
      array.push(`${headingFont}:400`);
    }
    if (!isEmpty(quoteFont)) {
      array.push(`${quoteFont}:400i`);
    }
    if (!isEmpty(modalSubtitle)) {
      array.push(`${modalSubtitle}:300`);
    }

    return array;
  }

  constructor() {
    super();
    this.state = {
      styles: null,
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.pageData.values.customColors && newProps.pageData.values.customFonts) {
      const { pageData: { values: { customColors, customFonts: { headingFont, bodyFont, quoteFont, modalSubtitle } } } } = newProps;
      const $primary = customColors[0].value;
      const $red = customColors[1].value;
      const $cyan = customColors[2].value;
      const $cyan2 = customColors[3].value;
      const $cyan3 = customColors[4].value;
      const $lightBrown = customColors[5].value;

      const bodyFontStyles = (!isEmpty(bodyFont)) ?
        `body{
        font-family: ${bodyFont}, sans-serif !important;
      }
      `
        : '';

      const headingFontStyles = (!isEmpty(headingFont)) ?
        `.hero-content .hero-content__text-wrapper .hero-content__title{
        font-family: ${headingFont}  !important;
      }

      .large-ribbon .large-ribbon__title{
        font-family: ${headingFont}  !important;
      }

      .large-ribbon .large-ribbon__subtitle{
        font-family: ${headingFont}  !important;
      }
      `
        : '';

      const modalSubtitleFontStyles = (!isEmpty(modalSubtitle)) ?
        `.modal__subtitle{
        font-family: ${modalSubtitle}  !important;
      }
      `
        : '';

      const quoteFontStyles = (!isEmpty(quoteFont)) ?
        `.quote-section .quote-section__text-container{
        font-family: ${quoteFont}  !important;
      }
      `
        : '';

      const styles = `
      ${bodyFontStyles}
      ${headingFontStyles}
      ${modalSubtitleFontStyles}
      ${quoteFontStyles}

      #floor-plans .carousel .carousel-indicators .indicator.active{
        background-color: ${$primary};
        border: 1px solid ${$primary};
      }

      .hero-content .hero-content__button{
        background-color: ${$primary};
      }

      .sn-success-container svg{
        color: ${$primary};
      }

      .color-primary{
        color: ${$primary};
      }

      .button{
        background-color: ${$primary};
      }

      .button.button-animated-orange{
        background-color: ${$primary};
        border-color: ${$primary};
      }

      .indicator.active{
        background: ${$primary};
      }

      .map-markers-container .map-markers .map-icon-container.active{
        background-color: ${$primary};
      }

      .map-markers-container .map-markers .map-icon-container.hover{
        background-color: ${$primary};
      }

      .gallery .gallery__overlay{
        background:rgba(${Head.hexToRGB($primary)} ,0.9);
      }

      .input-error{
        color: ${$red};
      }

      #floor-plans .card__title.bg-cyan{
        background-color:${$cyan};
      }

      #footer .footer__coyright-row{
        background-color: ${$cyan};
      }

      .bg-cyan{
        background-color: ${$cyan};
      }

      #footer .logo-banner{
        background-color: ${$cyan2};
      }

      #floor-plans .card__title{
        background-color: ${$cyan3};
      }

      #floor-plans .table-responsive{
        background-color: ${$cyan3};
      }

      #floor-plans .card__table{
        background-color: ${$cyan3};
      }

      #floor-plans .button-wrapper{
        background-color: ${$cyan3};
      }

      .navigation.nav-colored{
        background-color: ${$cyan3};
      }

      .sn-modal-content.sn-modal-content--light-brown{
        background-color: ${$lightBrown};
      }

      .bg-light-brown{
        background-color: ${$lightBrown};
      }
      `;

      this.setState({ styles });
    }
  }

  render() {
    const { isPageDataLoaded } = this.props;
    const { styles } = this.state;
    let content = null;

    if (isPageDataLoaded) {
      const { pageData: { values: { aditionalScript, generalData, facebookOpenGraphData, twitterCardData, googlePlusData, customFonts } } } = this.props;

      const fontLoaderScript = !isEmpty(customFonts) ? WebFont.load({
        google: {
          families: Head.populateArray(customFonts.headingFont, customFonts.bodyFont, customFonts.quoteFont, customFonts.modalSubtitle),
        },
      }) : null;

      content = (
        <Helmet>
          <script >
            {fontLoaderScript}
          </script>
          <script>
            {aditionalScript}
          </script>
          <title>{generalData.title}</title>
          <meta name="subject" content={generalData.subject} />
          <link rel="icon" sizes="192x192" href={generalData.icon} />
          <link rel="apple-touch-icon" href={generalData.appleTouchIcon} />
          <link rel="mask-icon" href={generalData.mask.icon} color={generalData.mask.color} />
          <meta name="theme-color" content={generalData.themeColor} />
          <meta name="description" content={generalData.description} />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <script defer src="/static/fonts/fontawesome-all.js" />
          {/* FACEBOOK META */}
          <meta property="fb:app_id" content={facebookOpenGraphData.appId} />
          <meta property="og:url" content={facebookOpenGraphData.url} />
          <meta property="og:type" content={facebookOpenGraphData.type} />
          <meta property="og:title" content={facebookOpenGraphData.title} />
          <meta property="og:image" content={facebookOpenGraphData.image} />
          <meta property="og:description" content={facebookOpenGraphData.description} />
          <meta property="og:site_name" content={facebookOpenGraphData.siteName} />
          <meta property="og:locale" content={facebookOpenGraphData.locale} />
          <meta property="article:author" content={facebookOpenGraphData.author} />
          {/* TWITTER META */}
          <meta name="twitter:card" content={twitterCardData.card} />
          <meta name="twitter:site" content={twitterCardData.site} />
          <meta name="twitter:creator" content={twitterCardData.creator} />
          <meta name="twitter:url" content={twitterCardData.url} />
          <meta name="twitter:title" content={twitterCardData.title} />
          <meta name="twitter:description" content={twitterCardData.description} />
          <meta name="twitter:image" content={twitterCardData.image} />
          {/* GOOGLE+ META */}
          <link rel="author" href={googlePlusData.author} />
          <link rel="publisher" href={googlePlusData.publisher} />
          <meta itemProp="name" content={googlePlusData.name} />
          <meta itemProp="description" content={googlePlusData.description} />
          <meta itemProp="image" content={googlePlusData.image} />
          {/* PINTEREST META */}
          <meta name="pinterest" content="nopin" description="Sorry, you can't save from my website!" />
        </Helmet>
      );
    }

    return (content);
  }
}

Head.defaultProps = {
  pageData: {},
};

Head.propTypes = {
  isPageDataLoaded: PropTypes.bool.isRequired,
  pageData: PropTypes.shape({}),
};

export default connect(selectors)(Head);
