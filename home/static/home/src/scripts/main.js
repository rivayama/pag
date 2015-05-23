/*** @jsx React.DOM */
'use strict';

// moduleを読み込む
var React = require('react');
var mount = document.getElementById('app-conteiner');
var Router = require('director').Router;

// Projectの一覧を生成
var ProjectList = React.createClass({
  render: function() {
    return (
      <ul>
        {this.props.data.map(function(result) {
           return <ListItemWrapper key={result.name} data={result}/>;
        })}
      </ul>
    );
  }
});

var ListItemWrapper = React.createClass({
  render: function() {
    return <li><a href="#/result" >{this.props.data.name}</a></li>;
  }
});

// App本体
var App = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      page: 'non'
    };
  },
  componentWillMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleSubmit: function(project) {
    var projects = this.state.data;
    var newProjects = projects.concat([project]);
    this.setState({data: newProjects});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: project,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    var setResultPage = function() {
      this.setState({ page: 'result'});
    }.bind(this);
    var setNonResultPage = function() {
      this.setState({ page: 'non' });
    }.bind(this);
    var router = Router({
      '/result': setResultPage,
      '*': setNonResultPage,
    });
    router.init();
  },
  render: function() {
    var page = this.state.page === 'result' ?
      <h2>分析結果を表示</h2> :
      <h2> </h2> ;
    return (
      <div className="Project Auto Grader">
        <h2>Result</h2>
        <ProjectList data={this.state.data} />
        {page}
      </div>
    );
  }
});

React.render(<App url="/api/projects/" />, mount);
