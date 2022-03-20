import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ClassCodeForm extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        classCode: PropTypes.string,
    }
  constructor(props) {
    super(props);
    
    const { data } = this.props;
    const { classCode: code } = data;

    this.state = {
      classCode: code,
      showData: false,
      showButton: false,
      showButtonName: "Add Class"
    };

    this.handleOnchage = this.handleOnchage.bind(this);
    this.handleSave = this.handleSave.bind(this);
    
}

  handleOnchage(e) {
    const key = e.target.name;
    const value = e.target.value;
    this.setState({
      [key]: value
    });

    /** Hiding if user changes the form data */
    const { showData } = this.state;
    if (showData) {
      this.setState(prevState => ({
        showData: !prevState.showData,
        showButton: !prevState.showButton
      }));
    }
  }

  checkSaveButton() {
    const { classCode: code } = this.props.data;
    const { classCode } = this.state;
    const changed = classCode !== code;
    return changed ? false : true;
  }

  handleSave(e) {
    e.preventDefault();
    this.setState(prevState => ({
      showButton: !prevState.showButton,
      showButtonName: "SAVING..."
    }));

    /** Mocking we updating the API and using the response to update the state */
    setTimeout(() => {
      this.setState(prevState => ({
        showData: !prevState.showData,
        showButtonName: "SAVE"
      }));
    }, 3000);
  }

  render() {
    const {
      classCode,
      showData,
      showButton,
      showButtonName
    } = this.state;
    const findButtonStatus = showButton || this.checkSaveButton();

    const renderButton = (
      <button
        type="submit"
        onClick={this.handleSave}
        disabled={findButtonStatus}
      >
        {showButtonName}
      </button>
    );

    // const fullName = (
    //   <p className="showData">
    //     {classCode} 
    //   </p>
    // );

    // const displayClassCode = showData ? fullName : null;
    return (
      <div>
        <form>
          <label> Class Code : </label>
          <input
            type="text"
            name="classCode"
            value={classCode}
            onChange={this.handleOnchage}
          />
          {renderButton}
        </form>
        {showData ? alert("Class Saved!") : null}
      </div>
    );
  }
}

export default ClassCodeForm;
