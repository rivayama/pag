/** @jsx React.DOM */
'use strict';

var React   = require('react');
var Randing = require('./randing.js');
var Grader  = require('./grader.js');

var App = React.createClass({

  loadProjects: function() {
    $.ajax({
      url: '/api/projects',
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (data.length > 0) {
          this.setState({page: 'grader', projects: data});
        } else {
          this.setState({page: 'randing'});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      page: 'loading',
      projects: [],
    };
  },

  render: function() {
    if (this.state.page === 'loading') {
      return <div></div>;

    } else if (this.state.page === 'randing') {
      $('body').attr('id', 'randing');
      return <Randing />;

    } else if (this.state.page === 'grader') {
      $('body').attr('id', 'grader');
      return <Grader data={this.state.projects}/>;
    }
  },

  componentDidMount: function() {
    this.loadProjects();
  }

});

React.render(
  <App />,
  document.getElementById('app-conteiner')
);
