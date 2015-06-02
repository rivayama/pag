/** @jsx React.DOM */
'use strict';

var React = require('react');
var Router = require('director').Router;

var ButtonInput = require('react-bootstrap').ButtonInput;

// {{{ Randing page
var RandingPage = React.createClass({
  render: function() {
    return (
      <div className="cover-container">
        <div className="masthead clearfix">
          <div className="inner">
            <h3 className="masthead-brand">PAG</h3>
          </div>
        </div>
        <div className="inner cover">
          <h1 className="cover-heading">Project Auto Grader</h1>
          <p className="lead">Backlogのスペース名を入力してください。認証後、プロジェクトの採点が始まります。</p>
          <p className="lead">
            <form action="/auth/" method="post" className="form-inline">
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">http://</div>
                  <input type="text" name="space" className="form-control input-lg" id="exampleInputAmount" placeholder="Space name"/>
                  <div className="input-group-addon">.backlog.jp</div>
                </div>
              </div>
              <ButtonInput type="submit" value="Grade Your Project" bsSize="large" />
            </form>
          </p>
        </div>
        <div className="mastfoot">
          <div className="inner">
            <p>2015 Koyama PBL / AIIT</p>
          </div>
        </div>
      </div>
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
        {this.props.data.map(function(grade) {
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

    return <div className="site-wrapper-inner">{page}</div>;
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
