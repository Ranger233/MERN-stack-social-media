import React, { Fragment } from 'react';
import spinner from './yellowSpinner.gif';

const Spinner = () => (
  <Fragment>
    <img
      src={spinner}
      style={{ width: '50%', margin: 'auto', display: 'block' }}
      alt='Loading...'
    />
  </Fragment>
);

export default Spinner