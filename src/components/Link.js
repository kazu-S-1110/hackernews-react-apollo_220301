import React from 'react';

export const Link = (props) => {
  const { link } = props;
  return (
    <div>
      <div>
        {link.description}({link.url})
      </div>
    </div>
  );
};
