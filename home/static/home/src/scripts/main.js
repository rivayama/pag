/** @jsx React.DOM */
'use strict';

var React = require('react');
var Router = require('director').Router;

// {{{ Randing page
var RandingPage = React.createClass({
  render: function() {
    var paperStyle = {
      position: 'fixed',
      zIndex: '9999',
      top: '20%',
      left: '0',
      right: '0',
      margin: '0 auto',
      width: '500px',
      textAlign: 'center'
    };
    return (
      <div>
        <AuthForm />
      </div>
    );
  }
});

var AuthForm = React.createClass({
  render: function() {
    return (
      <form action="/auth/" method="post">
        http://
        <input type="text" name="space" id="space"/>
        .backlog.jp
        <input type="submit" value="Go!" />
      </form>
    );
  }
});
// }}}

// {{{ Grader page
var Grader = React.createClass({
  render: function() {
    return (
      <div>
        <ProjectList data={this.props.data} />
      </div>
    );
  }
});
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
var GradeList = React.createClass({
  render: function() {
    console.log(this.props.data);
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
// }}}

// {{{ App
var App = React.createClass({

  loadProjects: function() {
    $.ajax({
      url: '/api/projects',
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (data.length > 0) {
          this.setState({page: 'authorized', projects: data});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      page: 'unauthorized',
      projects: [],
    };
  },

  componentWillMount: function() {},

  render: function() {
    var page = this.state.page === 'unauthorized' ?
      <RandingPage /> :
      <Grader data={this.state.projects}/>

    var barStyle = {
      zIndex: '9999'
    };

    return (
      <div className="pag">
        {page}
      </div>
    );
  },

  componentDidMount: function() {
    var router = Router({
      '/grade/:project_id': function(){},
      '*': function(){}
    });
    router.init();
    this.loadProjects();
  }

});
// }}}

React.render(<App />, document.getElementById('app-conteiner'));
