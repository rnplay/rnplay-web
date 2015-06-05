var QrModal = React.createClass({
  getInitialState: function() {
    return { qrCodeUrl: null }
  },

  componentDidMount: function() {
    var self = this;

    $.get('/apps/' + this.props.urlToken + '/qr', function(result) {
      self.setState({qrCodeUrl: result.url});
    });
  },

  renderImage: function() {
    if (this.state.qrCodeUrl) {
      return <img src={this.state.qrCodeUrl} />
    } else {
      return <span />
    }
  },

  render: function() {
    return (
      <Modal isOpen={this.props.isOpen} onClickBackdrop={this.props.onClickBackdrop}>
        <div className="modal--body qr-modal-body">
          <h1>Scan this with the Playground app</h1>
          {this.renderImage()}
        </div>
      </Modal>
    )
  }
});
