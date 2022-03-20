//create individual tabs
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//The PropTypes in this component are used to ensure that activeTab and label are a string 
//and required. onClick is set to be a function that is also required.
//The Tab component displays the name of the tab and adds an additional class if the tab is active. 
//When clicked, the component will fire a handler, onClick, that will let the Tabs component know 
//which tab should be active.
class Tab extends Component {
    static propTypes = {
      activeTab: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    };
  
    onClick = () => {
      const { label, onClick } = this.props;
      onClick(label);
    }
  
    render() {
      const {
        onClick,
        props: {
          activeTab,
          label,
        },
      } = this;
  
      let className = 'tab-list-item';
  
      if (activeTab === label) {
        className += ' tab-list-active';
      }
  
      return (
        <li className={className} onClick={onClick}>
          {label}
        </li>
      );
    }
  }
  
export default Tab;