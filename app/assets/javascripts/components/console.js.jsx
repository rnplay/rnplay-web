var Console = React.createClass({
  componentDidMount: function() {
    // var eventSource = new EventSource('http://localhost:9292/log/'+this.props.app.id);

    // console.log("Connecting to SSE server");
    // eventSource.addEventListener('log', function(event) {

    //   $(".console").append("<p>"+JSON.parse(event.data).log_entry+"</p>");
    // }, false);
  },

  render: function() {
    return (
      this.props.isVisible ?
      <div className="console">
        testing
      </div>
      : null
    )
  }
});

