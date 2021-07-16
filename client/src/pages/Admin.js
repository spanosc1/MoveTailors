import React from 'react';
import axios from 'axios';

import userService from "../services/userService";
import Modal from './../components/Modal';

import './../css/Admin.css';

class Admin extends React.Component {
  state = {
    file: null,
    isSelected: false,
    submitting: false,
    modal: false,
    message: ""
  };

  componentDidMount() {
    const u = userService.getUser();
    if(u)
    {
      if(u.email !== "otso.massala@movetailors.com")
      {
        this.props.history.push('/');
      }
    }
    else
    {
      this.props.history.push('/');
    }
  }

  onChangePorts = (event) => {
    if(event.target.files[0].name)
    {
      const ext = event.target.files[0].name.split('.').pop();  
      if(ext === 'xlsx')
      {
        this.setState({
          file: event.target.files[0],
          isSelected: true
        })
      }
      else
      {
        this.setState({
          file: null,
          isSelected: false
        });
        event.target.value = null;
        alert("File must be an Excel file with extension '.xlsx'");
      }
    }
    else
    {
      this.setState({
        file: null,
        isSelected: false
      });
      alert("Something is wrong with the file.");
    }
  }

  handleSubmission = () => {
    if(!this.state.file)
    {
      this.setState({
        modal: true,
        message: "Please select a file."
      })
    }
    else if(!this.state.submitting)
    {
      this.setState({
        submitting: true
      });
      const data = new FormData();
      data.append('file', this.state.file);
      axios.post('/admin/updatefile', data, {})
      .then(res => {
        if(res.data.message === "Success")
        {
          this.setState({
            modal: true,
            message: "The data is being updated.  This will take a few seconds.  Please check Strapi to confirm your update is correct.",
            submitting: false
          });
        }
        else
        {
          this.setState({
            modal: true,
            message: res.data.message,
            submitting: false
          });
        }
      });
    }
  }

  render() {
    return (
      <div className="adminContainer">
        <Modal
          visible={this.state.modal}
        >
          <p className="modalMessage">
            {this.state.message || "Test message"}
          </p>
          <button className="modalButton modalConfirm" onClick={() =>  this.setState({modal: false})}>
            OK
          </button>
        </Modal>
        <div className="adminControls">
          <p className="adminExplainer tahoma">
            Here you can upload an updated Excel file containing all port information and all cost information for all combinations of ports.
            Please keep the format of the sheets as well as the sheet names consistent with each upload.
          </p>
          <input className="tahoma" type="file" name="file" onChange={this.onChangePorts} />
          <button className="adminSubmit tahomaBold" onClick={this.handleSubmission}>{this.state.submitting ? "Working..." : "Submit"}</button>
        </div>
      </div>
    )
  }
}

export default Admin;