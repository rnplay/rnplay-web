var Modal = React.createClass({
  render: function() {
    var cx = React.addons.classSet,
        classes = cx({'modal-container': true,
                      'is-visible': this.props.isOpen});

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
