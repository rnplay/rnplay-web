'use strict';

import React, { Component } from 'react';

export default class ErrorView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      displayItems: true
    };
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.hideItems);

    this.hideItems = setTimeout(() => {
      this.setState({
        displayItems: false
      });
    }, 1000);

    this.setState({
      displayItems: true
    });
  }

  render() {
    const { displayItems } = this.state;
    let { error } = this.props;
    error = Array.isArray(error) ?
      error :
      [error];

    return (
      <div className='errorview-wrapper'>
        {displayItems && error.map((err, i) => (
          err ? <div key={i} className='alert-box'>{err}</div> : null
        ))}
      </div>
    )
  }

}
