if (typeof require == 'function') {
  var React = require("react");
  var cx = require('react-classset');
  var Backdrop = require('./backdrop.js');
}

var Modal = React.createClass({
  render: function() {
    var classes = cx({
      'modal-container': true,
      'is-visible': this.props.isOpen
    });

    return (
      <div className={classes}>
        <div className="modal">
          {this.props.children}
        </div>

        <Backdrop type="dark" isVisible={this.props.isOpen} onClick={this.props.onClickBackdrop} />
      </div>
    )
  }
});

if (typeof module !== 'undefined') {
  module.exports = Modal;
}
