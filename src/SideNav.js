import React, {
  Component
} from 'react';

class SideNav extends Component {
  state = {
    query: ''
  }
  render = () => {
    return (
      <div id = "nav" >
      <input type = "text"
      placeholder = "Filter by location names"
      id = "filter"
      aria-label = "Search Filter"
      onChange = {this.props.filter}/>
      <ul id = "items-list" aria-label = "list of places" role = "navigate" >
      {
        this.props.places.map((mark,index) => {
            return ( < li key = {index}
              className = "elementss"
              onClick = {
                this.props.openInfoWindow.bind(this,mark)
              }
              value = {
                this.state.query
              }
              tabIndex = {
                this.props.isOpen ? -1 : 0} >
              {
                mark.title
              } < /li>)
            })
        }
        </ul>
        </div>
      );

    }
  }
  export default SideNav
