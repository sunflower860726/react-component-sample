import PropTypes from 'prop-types';
import React from 'react';

const Ribbon = (props) => {
  const { title, children } = props;

  return (
    <section className="container-fluid ribbon">
      <div className="row">
        <article className="offset-md-2 col-md-8">
          <h2 className="section-title">{title}</h2>
          {children}
        </article>
      </div>
    </section>
  );
};

Ribbon.propTypes = {
  children: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
};

export default Ribbon;
