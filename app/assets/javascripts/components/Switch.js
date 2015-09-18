import React, { Component } from 'react';

export default class Switch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.value || this.props.defaultValue || 0
    };
  }

  renderChildren = () => {
    return this.props.children.map(function(child, index) {
      var selected = child.props.value === this.state.selected || index === this.state.selected;
      return (
        <label htmlFor={`sc-${this.props.name}${index}`}
          className={`label ${selected ? ' selected' : ''}`}
          key={`sc-${this.props.name}${index}`}>
          <input
            type="radio"
            name={`sc-${this.props.name}`}
            id={`sc-${this.props.name}${index}`}
            value={child.props.value || index}
            checked={selected}
            onChange={this.handleChange}
          />
            {child}
        </label>
      )
    }.bind(this));
  }

  handleChange = (e) => {
    var index = e.currentTarget.value;
    this.setState({selected: index}, () => {
      if (this.props.onChange) {
       this.props.onChange(index);
      }
    })
  }

  componentDidMount() {
    if (!this.props.defaultValue && this.props.onChange) {
     this.props.onChange(this.state.selected);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value || nextProps.defaultValue !== this.props.defaultValue) {
     this.setState({selected: nextProps.value || nextProps.defaultValue});
    }
  }

  render() {
    return (
      <div className={`switch ${this.props.className}`}>
        {this.renderChildren()}
      </div>
    )
  }
}

module.exports = Switch;
