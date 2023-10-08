// Option.js

import React, { Component } from "react";

class Options extends Component {
  render() {
    const { options, selectedOption, onOptionChange } = this.props;
    var qno = 1;

    return (
      <div className="options">
        {options.map((option, index) => (
          <div key={index} className="form-check">
            <input
              type="radio"
              name="option"
              value={option}
              checked={selectedOption === option}
              onChange={onOptionChange}
              className="form-check-input"
              style={{ border: "1px solid black" }}
            />
            <label className="form-check-label" style={{color:"black"}}>{option}</label>
          </div>
        ))}
      </div>
    );
  }
}

export default Options;
