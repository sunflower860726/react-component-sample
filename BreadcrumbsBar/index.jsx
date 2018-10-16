import PropTypes from 'prop-types';
import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Spinner } from '../../../common/components';
import selectors from './selectors';

import { paths } from '../../../../../common/constants';

const BreadcrumbsBar = (props) => {
  const { homeData, location: { pathname }, floorPlansData, isPageDataLoaded, title } = props;

  let content = <Spinner />;

  if (isPageDataLoaded) {
    const style = {
      backgroundImage: `url(${floorPlansData.values.breadcrumbsBar.image})`,
    };

    content = (
      <div id="breadcrumbs-bar" style={style} className="container-fluid">
        <div className="row h-100 align-items-center">
          <div className="offset-md-2 col-md-8 breadcrumbs__container">
            <h1 className="breadcrumbs__title">
              {homeData.values.propertyName} {title}
            </h1>
            <div className="breadcrumbs__links">
              <Link to={paths.client.BASE}>Home</Link>
              <span> / </span>
              <Link to={pathname}>{title}</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    content
  );
};

BreadcrumbsBar.defaultProps = {
  floorPlansData: {},
  homeData: {},
};

BreadcrumbsBar.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  isPageDataLoaded: PropTypes.bool.isRequired,
  floorPlansData: PropTypes.shape({}),
  homeData: PropTypes.shape({}),
  title: PropTypes.string.isRequired,
};

export default connect(selectors)(withRouter(BreadcrumbsBar));
