'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';

const formatDate = (date) => date.toISOString().replace('T', ' ').replace('Z', '');

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
    const classes = classNames({
      'editor-logger': true,
      'editor-logger--open': open
    });

    const { logs } = this.props;

    const toggleIcon = open ? 'down' : 'up';
    const toggleIconClasses = `fa fa-angle-${toggleIcon}`;

    return (
      <div className={classes}>
        <div className="editor-logger__bar">
          <button onClick={this.onToggle} className='editor-logger__toggle'>
            {!!unread && <span className='editor-logger__unread'>{unread}</span>}
            <span>Console Logs</span>
          </button>
          <button onClick={this.onToggle} className='editor-logger__button'>
            <i className={toggleIconClasses}></i>
          </button>
        </div>
        <div ref='content' className='editor-logger__content'>
          <div ref='contentInner'>
            {!!logs.length && logs.map((log) => (
              <div key={log.id} className='editor-logger__entry'>
                {log.msgType !== 'debug' && <span className="editor-logger__entry--timestamp">[{formatDate(log.timestamp)}] </span>}
                {log.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
