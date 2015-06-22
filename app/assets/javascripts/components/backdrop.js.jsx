if (typeof require == 'function') {
  var React = require("react");
  var cx = require('react-classset');
}

var Backdrop = React.createClass({
  render: function() {
    var classes = cx({
      'backdrop': true,
      'is-light': this.props.type == 'light',
      'is-visible': this.props.isVisible
    });

    return (
      <div onClick={this.props.onClick}
           className={classes}></div>
    )
  }
});


if (typeof module !== 'undefined') {
  module.exports = Backdrop;
}
