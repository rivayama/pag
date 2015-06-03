/** @jsx React.DOM */
'use strict';

var React = require('react');
var ButtonInput = require('react-bootstrap').ButtonInput;

// {{{ Randing page
var RandingPage = React.createClass({
  render: function() {
    return (
      <div className="site-wrapper-inner">
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
       </div>
    );
  }
});
// }}}

// {{{ Grader
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

        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">PAG</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav navbar-right">
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">Profile</a></li>
                <li><a href="#">Help</a></li>
              </ul>
              <form className="navbar-form navbar-right">
                <input type="text" className="form-control" placeholder="Search..." />
              </form>
            </div>
          </div>
        </nav>

        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3 col-md-2 sidebar">
              <ul className="nav nav-sidebar">
                {this.props.data.map(function(project, i) {
                  return <li><a href={'#/grade/'+project.id} key={i} onClick={this.loadGrade.bind(this, i)}>{project.name}</a></li>;
                }.bind(this))}
              </ul>
            </div>
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
              <GradeList data={this.state.grade} />
            </div>
          </div>
        </div>

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
    if (this.state.page === 'unauthorized') {
      $('body').attr('id', 'randing');
    } else {
      $('body').attr('id', 'grader');
    }

    return this.state.page === 'unauthorized' ?
      <RandingPage /> :
      <Grader data={this.state.projects}/>
  },

  componentDidMount: function() {
    this.loadProjects();
  }

});
// }}}

React.render(
  <App />,
  document.getElementById('app-conteiner')
);
