'use strict';

import React, { Component } from 'react';
import cx from 'react-classset';

export default class Editor extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false
    };

  }

  onToggle = () => {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const classes = cx({
      'logger': true,
      'open': this.state.open
    });

    const logs = ['some, log', 'another log', 'more stuff ', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'];

    return (
      <div className={classes}>
        <button onClick={this.onToggle} className='logger__toggle'>
          <span>Log</span>
        </button>
        <div className='logger__content'>
          {logs.map((log) => <div className='logger__entry'>{log}</div>)}
        </div>
      </div>
    );
  }
}
