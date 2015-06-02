/** @jsx React.DOM */
'use strict';

var React = require('react');
var Router = require('director').Router;

var ButtonInput = require('react-bootstrap').ButtonInput;

// {{{ Randing page
var RandingPage = React.createClass({
  render: function() {
    return (
      <AuthForm />
    );
  }
});

var AuthForm = React.createClass({
  render: function() {
    return (
      <form action="/auth/" method="post" className="lead">
        <p>http://<input type="text" name="space" id="space"/>.backlog.jp</p>
        <ButtonInput type="submit" value="Grade Your Project" bsSize="large" />
      </form>
    );
  }
});
// }}}

// {{{ Project list
var Grader = React.createClass({

  getInitialState: function() {
    return {
      grade: []
    };
  },

  loadGrade: function(i) {
    var project = this.props.data[i];
    $.ajax({
      url: '/api/grade/' + project.id,
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (data.length > 0) {
          this.setState({grade: data});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div>
        <ul>
          {this.props.data.map(function(project, i) {
            return (
              <li>
                <a href={'#/grade/'+project.id} key={i} onClick={this.loadGrade.bind(this, i)}>{project.name}</a>
              </li>
            );
          }.bind(this))}
        </ul>
        <GradeList data={this.state.grade} />
      </div>
    );
  }

});
// }}}

// {{{ Grade
var GradeList = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired
  },

  getDefaultProps: function() {
    return {
      data: [{'grade': []}, {'adivice': []}]
    }
  },

  render: function() {
    console.log(this.props.data);
    return (
      <table>
        {this.props.data[0]['grade'].map(function(grade) {
          console.log(grade);
          return <GradeItemWrapper key={grade.title} data={grade}/>;
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
          this.setState({page: 'project', projects: data});
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

    return <div className="pag">{page}</div>;
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

React.render(
  <App />,
  document.getElementById('app-conteiner')
);
