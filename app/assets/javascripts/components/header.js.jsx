if (typeof require == 'function') {
  var React = require("react");
}

var Header = React.createClass({
  getInitialState: function() {
    return { qrModalIsVisible: false }
  },

  renderMyApps: function() {
    if (this.props.currentUser) {
      return (<li><a href="/apps">My Apps</a></li>);
    }

    return null;
  },

  renderSignInOutLink: function() {
    const { currentUser } = this.props;

    if (currentUser) {
      return (
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
            <i className="fa fa-gear"></i>
          </a>
          <ul className="dropdown-menu" role="menu" aria-labelledby="settings-menu">
            <li role="presentation"><a href="/users/edit">Profile</a></li>
            <li><a rel="nofollow" data-method="delete" href="/users/sign_out">Sign Out</a></li>
          </ul>
        </li>
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
      <div className="container-fluid header">
        <div className="row">
          <div className="col-xs-12">
            <nav className="navbar navbar-default">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-main">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a href="/" className="pull-left navbar-logo hidden-mobile">
                  <img src={this.props.headerLogoSrc} className="img-responsive" width="24" />
                </a>
                <a className="navbar-brand" href="/">React Native Playground</a>
              </div>

              <div className="collapse navbar-collapse" id="navbar-collapse-main">
                <ul className="nav navbar-nav navbar-right">
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    );
  }
});

if (typeof module !== 'undefined') {
  module.exports = Header;
}
