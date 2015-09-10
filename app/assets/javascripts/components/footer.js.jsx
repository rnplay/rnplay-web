if (typeof require == 'function') { var React = require("react"); }

var Footer = React.createClass({
  render: function() {
    return (
      <footer className="rnplay-footer">
        <div className="row">
          <div className="col-xs-12">
            <p><a href="/contact">Contact</a> | <a href="/privacy">Privacy</a></p>
            <p><a href="https://github.com/rnplay">React Native Playground on Github</a>.</p>
            <p>Simulator by <a href="http://appetize.io">appetize.io</a>.</p>
          </div>
        </div>
      </footer>
    )
  }
});


if (typeof module !== 'undefined') {
  module.exports = Footer;
}
