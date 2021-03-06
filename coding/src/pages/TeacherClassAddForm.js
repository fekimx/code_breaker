import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axiosService from "../utils/axios";

class TeacherClassAddForm extends Component {
  static propTypes = {
      data: PropTypes.object.isRequired,
      className: PropTypes.string,
  }
  constructor(props) {
    super(props);
    
    const { data } = this.props;
    const { teacherId: teacherId, fetchLatestClasses: fetchLatestClasses } = data;

    this.state = {
      teacherId: teacherId,
      fetchLatestClasses: fetchLatestClasses,
      className: "",
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
    const { className: code } = this.props.data;
    const { className } = this.state;
    const changed = className !== code;
    return changed ? false : true;
  }

  handleSave(e) {
    e.preventDefault();
    axiosService.post(`/api/class/`, { teacher: this.state.teacherId, name: this.state.className, assignments: [], active: true, TAs: [], students: [] })
    .then((res) => {
      this.state.fetchLatestClasses(1);
      this.setState({
        className: ""
      })
    })
    .catch((err) => {
      console.log("Received an error while creating question", err);
    });
  }

  render() {
    const {
      className,
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
          <label> Add new class: &nbsp;</label>
          <input
            type="text"
            className="border-b border-gray-300 w-full px-2 h-8 rounded focus:border-blue-500"
            name="className"
            value={className}
            onChange={this.handleOnchage}
          />
          {renderButton}
        </form>
        {showData ? alert("Class Added!") : null}
      </div>
    );
  }
}

export default TeacherClassAddForm;
