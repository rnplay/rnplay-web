if (typeof require == 'function') { var React = require("react"); }

var Footer = React.createClass({
  render: function() {
    return (
      <footer className="rnplay-footer">
        <div className="row">
          <div className="col-xs-12">
            <p className="footer-links">
              <a href="/about">About</a> 
              <a href="/privacy">Privacy</a>
              <a href="https://github.com/rnplay">We're on Github!</a>
            </p>
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
