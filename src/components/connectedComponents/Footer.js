import React, { Component } from "react";
import { connect } from "react-redux";

class Footer extends Component {
  render() {
    return <div className={`main-footer`}>Copyright blah blah. Footer</div>;
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = {};

export default Footer;
