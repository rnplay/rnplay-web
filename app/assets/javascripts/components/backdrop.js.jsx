var Backdrop = React.createClass({
  render: function() {
    var cx = React.addons.classSet,
        classes = cx({'backdrop': true,
                      'is-light': this.props.type == 'light',
                      'is-visible': this.props.isVisible});

    return (
      <div onClick={this.props.onClick}
           className={classes}></div>
    )
  }
});
