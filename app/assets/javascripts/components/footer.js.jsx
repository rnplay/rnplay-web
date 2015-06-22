if (typeof require == 'function') { var React = require("react"); }

var Footer = React.createClass({
  render: function() {
    return (
      <footer className="rnplay-footer">
        <div className="row">
          <div className="col-xs-12">
            <span className="pull-left"><a href="/contact">Contact</a> | <a href="/privacy">Privacy</a></span>
            <a href="https://github.com/rnplay">React Native Playground on Github</a>. Simulator by <a href="http://appetize.io">appetize.io</a>.
          </div>
        </div>
      </footer>
    )
  }
});
