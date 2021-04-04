import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Form, FormGroup, Input, Button } from "reactstrap";
import { connect } from "react-redux";
import { Container, Row } from "reactstrap";

// --added by OY on 8/13/2020, the function that changes the color and the background color
// for the BootstrapTable table cell.
function rowStyleFormat(row, rowIdx) {
  return {
    backgroundColor: rowIdx % 2 === 0 ? "pink" : "lightblue",
    color: "darkblue",
  };
}

function tdStyleFormat() {
  return {
    backgroundColor: "yellow",
    color: "green",
  };
}

class Search extends Component {
  onChange = (e) => {
    if (e.target.value === "") {
      this.props.fetchData({ firstName: "*" });
    } else {
      this.props.fetchData({ firstName: e.target.value });
    }
  };

  onClear = (e) => {
    let searchInput = ReactDOM.findDOMNode(this.refs.searchInput);
    // alert(searchInput);
    searchInput = searchInput ? (searchInput.value = "") : "";
    this.props.fetchData({ firstName: "*" });
    // this.props.placeholder = "First Name";
  };

  onSubmit = (e) => {
    e.preventDefault();
  };

  renderTitleAndForm() {
    let titleAndForm = (
      <Container>
        <Row className="show-grid top10 headingFilter">
          <h2>Filter Authors Database by First Name</h2>
        </Row>
        <Row className="show-grid top10">
          <Form inline onSubmit={this.onSubmit}>
            <FormGroup>
              <Input
                type="search"
                name="search"
                ref="searchInput"
                id="searchInput"
                placeholder="First Name"
                onChange={this.onChange}
              />
            </FormGroup>
            <Button className="btn-ll5" onClick={this.onClear}>
              Clear
            </Button>
          </Form>
        </Row>
      </Container>
    );

    return titleAndForm;
  }

  renderFullForm() {
    let fullForm = (
      <Container>
        <Row className="show-grid top10 headingFilter">
          <h2> Filter Authors Database by First Name</h2>
        </Row>
        <Row className="show-grid top10">
          <Form inline onSubmit={this.onSubmit}>
            <FormGroup>
              <Input
                type="search"
                name="search"
                id="searchInput"
                placeholder="First Name"
                onChange={this.onChange}
              />
            </FormGroup>
            <Button className="btn-ll5" onClick={this.onClear}>
              Clear
            </Button>
          </Form>
        </Row>
        <Row className="show-grid top10">
          <BootstrapTable
            data={this.props.searchData}
            search={false}
            trStyle={rowStyleFormat}
          >
            {/* if tdStyle={tdStyleFormat} added to TableHeaderColumn, it will override trStyle for the Row */}
            <TableHeaderColumn dataField="first_name">
              First Name
            </TableHeaderColumn>
            <TableHeaderColumn dataField="last_name" isKey={true}>
              Last Name
            </TableHeaderColumn>
          </BootstrapTable>
        </Row>
      </Container>
    );
    return fullForm;
  }

  render() {
    if (this.props.searchData.length !== 0) {
      return this.renderFullForm();
    } else {
      return this.renderTitleAndForm();
    }
  }
}

function mapStatetoProps(state) {
  return {
    searchData: state.searchData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchData: (firstName) =>
      dispatch({ type: "FETCH_SEARCH_DATA", payload: firstName }),
  };
}

const ConnectedSearch = connect(mapStatetoProps, mapDispatchToProps)(Search);

export default ConnectedSearch;
