if (typeof require == 'function') {
  var React = require("react");
}

var Header = React.createClass({
  getInitialState: function() {
    return { qrModalIsVisible: false }
  },

  renderMyApps: function() {
    if (this.props.currentUser) {
      return <li><a href="/apps">My Apps</a></li>;
    } else {
      return <span />
    }
  },

  renderSignInOutLink: function() {
    if (this.props.currentUser) {
      return (
        <div>
          <div className="dropdown" style={{display: 'inline-block'}}>
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" id="settings-menu"><span className="glyphicon glyphicon-cog"></span></a>
            <ul className="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="settings-menu">
              <li role="presentation"><a href="/users/edit">Profile</a></li>
              <li role="presentation">
                <a rel="nofollow" data-method="delete" href="/users/sign_out">Sign Out</a>
              </li>
            </ul>
          </div>
        </div>
      )
    } else {
      return (
        <li>
          <a href="/users/sign_in">Sign In</a>
        </li>
      )
    }
  },


  render: function() {
    return (
      <nav className="navbar navbar-default">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a href="/" className="pull-left navbar-logo">
            <img src={this.props.headerLogoSrc} className="img-responsive" width="35" />
          </a>
          <a className="navbar-brand" href="/">React Native Playground</a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav" id="links">
            <li><a href="/apps/new">New App</a></li>
            {this.renderMyApps()}
          </ul>
          <ul className="nav navbar-nav pull-right">
            <li><a href="/about">About</a></li>
            <li><a href="/help">Help</a></li>
            {this.renderSignInOutLink()}
          </ul>
        </div>
      </nav>
    );
  }
});


if (typeof module !== 'undefined') {
  module.exports = Header;
}
