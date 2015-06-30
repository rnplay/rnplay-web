'use strict';

import React, { Component } from 'react';
import cx from 'react-classset';

const formatDate = (date) => date.toISOString().replace('T', ' ').replace('Z', ' ');

export default class Editor extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      unread: props.logs.length
    };

  }

  onToggle = () => {
    this.setState({
      open: !this.state.open,
      unread: 0
    });
  }

  componentWillReceiveProps(nextProps) {
    const { length: nextLength } = nextProps.logs;
    const { length } = this.props.logs;
    const { unread, open } = this.state;

    if (!open && nextLength > length) {
      this.setState({
        unread: unread + (nextLength - length)
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { content, contentInner } = this.refs;
    const contentNode = React.findDOMNode(content);
    const contentInnerNode = React.findDOMNode(contentInner);
    contentNode.scrollTop = contentInnerNode.getBoundingClientRect().height;
  }

  render() {
    const { open, unread } = this.state;
    const classes = cx({
      'logger': true,
      'open': open
    });

    const { logs } = this.props;

    return (
      <div className={classes}>
        <button onClick={this.onToggle} className='logger__toggle'>
          {!!unread && <span className='logger__toggle__unread'>{unread}</span>}
          <span>Log</span>
        </button>
        <div ref='content' className='logger__content'>
          <div ref='contentInner'>
            {!!logs.length && logs.map((log) => (
              <div key={log.id} className='logger__entry'>
                {log.msgType !== 'debug' && `${formatDate(log.timestamp)} `}
                {log.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
