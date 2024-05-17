import React from 'react';
import classNames from 'classnames';
import {PanelProps} from '../interface/panel'

const Panel: React.FC<PanelProps> = ({ children, className, ...rest }) => {
  const finalClassNames = classNames(
    'border rounded p-3 shadow bg-white w-full',
    className
  );

  return (
    <div {...rest} className={finalClassNames}>
      {children}
    </div>
  );
}

export default Panel;
