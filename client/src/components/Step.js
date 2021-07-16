import React from 'react';

import './../css/Step.css';

var classNames = require("classnames");

class Step extends React.Component {
  render() {
    const stepContainer = classNames({
      "stepContainer": true,
      "stepContainerActive": this.props.active === this.props.stepNum
    });

    return (
      <div className={stepContainer} onClick={() => this.props.setActive(this.props.stepNum)}>
        <img className="stepImg" src={this.props.img} alt={this.props.title}/>
        <p className="stepName sofiaBold">{this.props.title}</p>
      </div>
    )
  }
}

export default Step;