/* eslint-disable no-unused-vars */
import React from 'react';
import { Gallery } from "react-grid-gallery";
import { IMG03,IMG04,IMG05 } from './img';

const Description = (props) => {
  const images = [
    {
      original: IMG03,
      thumbnail: IMG03,
    },
    {
      original: IMG04,
      thumbnail: IMG04,
    },
    {
      original: IMG05,
      thumbnail: IMG05,
    },
    // Add more images as needed
  ];
  return (

    <div>
      <Gallery items={images} />
      <div className="row">
        <div className="col-md-4 mb-2 mb-md-0">
          <a
            href={IMG03}
            className="image-popup-desc"
            data-title="Title 01"
            data-description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit"
          >
            <img
              src={IMG03}
              className="img-fluid"
              alt="work-thumbnail"
            />
          </a>
        </div>
        <div className="col-md-4 mb-2 mb-md-0">
          <a
            href={IMG04}
            className="image-popup-desc"
            data-title="Title 02"
            data-description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit"
          >
            <img
              src={IMG04}
              className="img-fluid"
              alt="work-thumbnail"
            />
          </a>
        </div>
        <div className="col-md-4 mb-2 mb-md-0">
          <a
            href={IMG05}
            className="image-popup-desc"
            data-title="Title 03"
            data-description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit"
          >
            <img
              src={IMG05}
              className="img-fluid"
              alt="work-thumbnail"
            />
          </a>
        </div>
      </div>
    </div>

  );
}


export default Description;