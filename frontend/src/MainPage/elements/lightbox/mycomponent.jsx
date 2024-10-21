/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Gallery } from "react-grid-gallery";
import { IMG01 ,IMG02} from './img';
const images = [
  {
    original: IMG01,
    thumbnail: IMG01,
  },
  {
    original: IMG02,
    thumbnail: IMG02,
  },
  // Add more images as needed
];

const MyComponent = (props) => {

  return (

    <div>
      <Gallery items={images} />

      <div className="row">
        <div className="col-md-4 mb-2 mb-md-0">
          <a href={IMG01} className="image-popup">
            <img src={IMG01} className="img-fluid" alt="image" />
          </a>
        </div>

        <div className="col-md-4 mb-2 mb-md-0">
          <a href={IMG02} className="image-popup">
            <img src={IMG02} className="img-fluid" alt="image" />
          </a>
        </div>
      </div>

    </div>

  );
}


export default MyComponent;