/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Link } from "react-router-dom";
import Popover from "react-bootstrap/Popover";
import { OverlayTrigger, Button, ButtonToolbar, PopoverHeader, PopoverBody } from "react-bootstrap";

const popper = () => {
  const popover1 = (
    <Popover id="popover-positioned-right" title="Popover right">
       <PopoverHeader as="h3">Popover title</PopoverHeader>
      <PopoverBody>
        <p>And here's some amazing content. It's very engaging. Right?</p>
      </PopoverBody>
    </Popover>
  );

  const popover2 = (
    <Popover id="popover-positioned-top" title="Popover top">
       <PopoverHeader as="h3">Popover title</PopoverHeader>
      <PopoverBody>
        <p>And here's some amazing content. It's very engaging. Right?</p>
      </PopoverBody>
    </Popover>
  );

  const popover3 = (
    <Popover id="popover-positioned-bottom" title="Popover bottom">
       <PopoverHeader as="h3">Popover title</PopoverHeader>
      <PopoverBody>
        <p>And here's some amazing content. It's very engaging. Right?</p>
      </PopoverBody>
    </Popover>
  );
  const popover4 = (
    <Popover id="popover-positioned-bottom" title="Popover bottom">
        <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
    </Popover>
  );
  const popover5 = (
    <Popover id="popover-positioned-bottom" title="Popover bottom">
       <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
    </Popover>
  );
  const popover6 = (
    <Popover id="popover-positioned-bottom" title="Popover bottom">
        <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
    </Popover>
  );
  const popover7 = (
    <Popover id="popover-positioned-bottom" title="Popover bottom">
        <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus.</p>
    </Popover>
  );

  return (
    <div className="page-wrapper cardhead">
      <div className="content">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Popover</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/dream-pos/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Popover</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          {/* Popover */}
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Basic Popover</h5>
              </div>
              <div className="card-body card-buttons">
                <div className="popover-list">
                  <ButtonToolbar>
                    <OverlayTrigger trigger="click" placement="right" overlay={popover1}>
                      <Button variant="primary" className='me-1'>Click to toggle popover</Button>
                    </OverlayTrigger>
                    <OverlayTrigger trigger="focus" placement="right" overlay={popover2}>
                      <Button variant="primary" className='me-1'>Dismissible popover</Button>
                    </OverlayTrigger>
                    <OverlayTrigger trigger={["focus", "hover"]} placement="bottom" overlay={popover3}>
                      <Button variant="primary" className='me-1'>On Hover Tooltip</Button>
                    </OverlayTrigger>
                  </ButtonToolbar>
                </div>
              </div>
            </div>
          </div>
          {/* /Popover */}
          {/* Popover */}
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Direction Popover</h5>
              </div>
              <div className="card-body card-buttons">
                <div className="popover-list">
                <ButtonToolbar>
                    <OverlayTrigger trigger="click" placement="top" overlay={popover4}>
                      <Button variant="primary" className='me-1'>Popover on top</Button>
                    </OverlayTrigger>
                    <OverlayTrigger trigger="click" placement="right" overlay={popover5}>
                      <Button variant="primary" className='me-1'>Popover on right</Button>
                    </OverlayTrigger>
                    <OverlayTrigger trigger="click" placement="bottom" overlay={popover6}>
                      <Button variant="primary" className='me-1'>Popover on bottom</Button>
                    </OverlayTrigger>
                    <OverlayTrigger trigger="click" placement="left" overlay={popover7}>
                      <Button variant="primary" className='me-1'>Popover on left</Button>
                    </OverlayTrigger>
                  </ButtonToolbar>
                </div>
              </div>
            </div>
          </div>
          {/* /Popover */}
        </div>
      </div>
    </div>
  );
};
export default popper;
