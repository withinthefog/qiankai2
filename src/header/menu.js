import React from 'react'

var Menu = React.createClass({
  render () {
    return (
      <div className='menu'>
      {this.props.children}
      </div>
    );
  }
});

export default Menu