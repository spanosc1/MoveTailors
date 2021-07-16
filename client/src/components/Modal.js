import React from 'react';

import './../css/Modal.css';

var classNames = require("classnames");

class Modal extends React.Component {
  render() {
    const modalContainerClass = classNames({
      modalContainer: true,
      modalVis: this.props.visible
    })
    return (
      <div className={modalContainerClass}>
        <div className="modalInner">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Modal;