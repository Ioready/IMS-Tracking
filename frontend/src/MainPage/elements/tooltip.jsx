/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Tooltip = () => {
  const [Place, setPlace] = useState();
  return (
    <div className="page-wrapper cardhead">
      <div className="content ">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Tooltip</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/dream-pos/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Tooltip</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          {/* Tooltip */}
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Html Element</h5>
              </div>
              <div className="card-body">
                <div className="popover-list">
                  <button
                    className="example-popover btn btn-primary"
                    type="button"
                    data-container="body"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Popover title"
                  >
                    Hover Me
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* /Tooltip */}
          {/* Popover */}
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Direction Tooltip</h5>
              </div>
              <div className="card-body">
                <div className="tooltip-list">
                  <button
                    type="button"
                    className="btn btn-primary me-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Tooltip on top"
                  >
                    Tooltip on top
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title="Tooltip on right"
                  >
                    Tooltip on right
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Tooltip on bottom"
                  >
                    Tooltip on bottom
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="left"
                    title="Tooltip on left"
                  >
                    Tooltip on left
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* /Popover */}
          {/* Tooltip */}
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Html Element</h5>
              </div>
              <div className="card-body">
                <div className="popover-list">
                  <button
                    type="button"
                    className="btn btn-primary me-1"
                    data-bs-toggle="tooltip"
                    data-bs-html="true"
                    title="<em>Tooltip</em> <u>with</u> <b>HTML</b>"
                  >
                    Tooltip with HTML
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary me-1"
                    data-bs-toggle="tooltip"
                    data-bs-trigger="click"
                    data-bs-html="true"
                    data-bs-placement="bottom"
                    title="<em>Tooltip</em> <u>with</u> <b>HTML</b>"
                  >
                    Click Me
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* /Tooltip */}
        </div>
      </div>
    </div>
  );
};
export default Tooltip;
