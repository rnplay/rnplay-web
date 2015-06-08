var SupportForm = React.createClass({

  getInitialState: function() {
    return { submitted: false }
  },

  onSubmit: function(e) {
    e.preventDefault();

    $.post('/contact', {
      email: this.refs.emailInput.getDOMNode().value,
      message: this.refs.messageInput.getDOMNode().value
    });

    this.setState({submitted: true});
    setTimeout(function() {
      window.location.href = '/';
    }, 5000)
  },

  renderForm: function() {
    return (
      <div className="support-form">
        <h2>Get in touch with us</h2>
        <form onSubmit={this.onSubmit}>
          <div>
            <input type="email" required="true" ref="emailInput" placeholder="Your email address" />
          </div>
          <div>
            <textarea ref="messageInput" required="true" placeholder="A brief description of your question or problem" />
          </div>

          <button className="btn-info">Submit support request</button>
        </form>
      </div>
    )
  },

  renderSuccess: function() {
    return (
      <div className="support-form">
        <div className="contact-form-submitted">
          Thanks! We will get back to you within 24 hours. Redirecting you back
          <a href="/"> home </a>
          in 5 seconds...
        </div>
      </div>
    )
  },

  render: function() {
    if (this.state.submitted) {
      return this.renderSuccess();
    } else {
      return this.renderForm()
    }
  }

});
