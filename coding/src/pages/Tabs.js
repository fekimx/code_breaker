//This component will keep track of which tab is active, display a list of tabs, 
//and the content for the active tab.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';

//keep track of state and display the active tab below the imports in Tabs.js
class Tabs extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
  }

  constructor(props) {
    super(props);

    //initial tab is the first one by default
    this.state = {
      activeTab: this.props.children[0].props.label,
    };
  }
    //will update the app state to the current tab that is clicked by the user
    onClickTabItem = (tab) => {
        this.setState({ activeTab: tab });
    }
    render() {
        const {
        onClickTabItem,
        props: {
            children,
        },
        state: {
            activeTab,
        }
        } = this;

    return (
      <div className="tabs">
        <ol className="tab-list">
          {children.map((child) => {
            const { label } = child.props;

            return (
              <Tab
                activeTab={activeTab}
                key={label}
                label={label}
                onClick={onClickTabItem}
              />
            );
          })}
        </ol>
        <div className="tab-content">
          {children.map((child) => {
            if (child.props.label !== activeTab) return undefined;
            return child.props.children;
          })}
        </div>
      </div>
    );
  }
}

export default Tabs;