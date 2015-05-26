/** @jsx React.DOM */
'use strict';

var React = require('react');
var Router = require('director').Router;

// Projectの一覧を生成
var ProjectList = React.createClass({
  render: function() {
    return (
      <ul>
        {this.props.data.map(function(result) {
           return <ProjectItemWrapper key={result.name} data={result}/>;
        })}
      </ul>
    );
  }
});
var ProjectItemWrapper = React.createClass({
  render: function() {
    return <li><a href={'#/grade/'+this.props.data.id}>{this.props.data.name}</a></li>;
  }
});

// 採点の一覧を生成
var GradeList = React.createClass({
  render: function() {
    return (
      <table>
        {this.props.data.map(function(result) {
           return <GradeItemWrapper key={result.title} data={result}/>;
        })}
      </table>
    );
  }
});
var GradeItemWrapper = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.data.title}</td>
        <td>{this.props.data.count}/{this.props.data.all_count}</td>
        <td>{this.props.data.point}</td>
      </tr>
    );
  }
});

// App本体
var App = React.createClass({
  getInitialState: function() {
    return {
      projects: [],
      grade: [],
      page: 'unauthorized'
    };
  },
  loadProjects: function() {
    $.ajax({
      url: '/api/projects',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({projects: data, page: 'projects'});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  loadGrade: function(project_id) {
    $.ajax({
      url: '/api/grade/' + project_id,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({grade: data, page: 'grade'});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    var setGradePage = function(project_id) {
      this.setState({grade: [], page: 'loading'});
      this.loadGrade(project_id);
    }.bind(this);
    var setUnauthorizedPage = function() {
      this.setState({page: 'unauthorized'});
    }.bind(this);
    var router = Router({
      '/grade/:project_id': setGradePage,
      '*': setUnauthorizedPage,
    });
    router.init();
    this.loadProjects();
  },
  render: function() {
    return (
      <div className="Project Auto Grader">
        <ProjectList data={this.state.projects} />
        <GradeList data={this.state.grade} />
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('app-conteiner')
);
