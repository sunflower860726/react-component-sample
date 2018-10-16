import PropTypes from 'prop-types';
import React from 'react';

const ElementRenderer = ({ returnParapgraphs, returnNumericList, data }) => data.map((item, key) => {
  if (returnParapgraphs) {
    return (<p key={key} dangerouslySetInnerHTML={{ __html: item }} />);
  }

  if (returnNumericList) {
    return (

      <li key={key}><span className="numeric-icon">{key + 1}</span> <span dangerouslySetInnerHTML={{ __html: item.text }} /></li>
    );
  }

  return (
    <li key={key} dangerouslySetInnerHTML={{ __html: item }} />
  );
});

ElementRenderer.defaultProps = {
  returnParapgraphs: false,
  returnNumericList: false,
};

ElementRenderer.propTypes = {
  returnParapgraphs: PropTypes.bool,
  returnNumericList: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({}),
  ]).isRequired),
};

export default ElementRenderer;
