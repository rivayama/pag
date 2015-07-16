var Table     = require('react-bootstrap').Table;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Grid       = require('react-bootstrap').Grid;
var Row       = require('react-bootstrap').Row;
var Col       = require('react-bootstrap').Col;
var Button    = require('react-bootstrap').Button;
var Loading    = require('./loading.js');

var GradeTotal = React.createClass({
  render: function() {
    var total = this.props.data;
    var starStyle = {
      color: '#FFCC00',
    };
    var starEmptyStyle = {
      color: '#9da0a4',
    };
    var border = {
      color: '#00ff00',
    };
    if (total.point < 50) {
      var summaryFont = 'danger';
      var summaryIcon = <Glyphicon glyph='fire' />;
      var summaryGrade = 'E';
      var summaryStar1 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryStar2 = <Glyphicon glyph='star-empty' style={starEmptyStyle} /> ;
      var summaryStar3 = <Glyphicon glyph='star-empty' style={starEmptyStyle} /> ;
      var summaryStar4 = <Glyphicon glyph='star-empty' style={starEmptyStyle} /> ;
      var summaryStar5 = <Glyphicon glyph='star-empty' style={starEmptyStyle} /> ;
      var summaryGradeStyle = {
        color: '#f89406',
      };
    } else if (total.point < 70){
      var summaryFont = 'danger';
      var summaryIcon = '';
      var summaryGrade = 'D';
      var summaryStar1 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryStar2 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryStar3 = <Glyphicon glyph='star-empty' style={starEmptyStyle} /> ;
      var summaryStar4 = <Glyphicon glyph='star-empty' style={starEmptyStyle} /> ;
      var summaryStar5 = <Glyphicon glyph='star-empty' style={starEmptyStyle} /> ;
      var summaryGradeStyle = {
        color: '#b94a48',
      };
    } else if (total.point < 85){
      var summaryFont = 'warning';
      var summaryIcon = '';
      var summaryGrade = 'C';
      var summaryStar1 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryStar2 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryStar3 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryStar4 = <Glyphicon glyph='star-empty' style={starEmptyStyle} /> ;
      var summaryStar5 = <Glyphicon glyph='star-empty' style={starEmptyStyle} /> ;
      var summaryGradeStyle = {
        color: '#f89406',
      };
    } else if (total.point < 95){
      var summaryFont = 'warning';
      var summaryIcon = '';
      var summaryGrade = 'B';
      var summaryStar1 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryStar2 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryStar3 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryStar4 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryStar5 = <Glyphicon glyph='star-empty'  style={starEmptyStyle}/> ;
      var summaryGradeStyle = {
        color: '#f89406',
      };
    } else if (total.point <= 100){
      var summaryFont = 'sucess';
      var summaryIcon = '';
      var summaryGrade = 'A';
      var summaryStar1 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryStar2 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryStar3 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryStar4 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryStar5 = <Glyphicon glyph='star' style={starStyle} /> ;
      var summaryGradeStyle = {
        color: '#468847',
      };
    }

    var total_point;
    if (typeof(total.point) != 'undefined') {
      total_point = <div>
            <span className="summarygrade" style={summaryGradeStyle} >
              <strong> {summaryIcon} {summaryGrade} ({total.point}%) </strong>
              <br/>
            </span>
            <div className="summarygradestar" >
              {summaryStar1}
              {summaryStar2}
              {summaryStar3}
              {summaryStar4}
              {summaryStar5}
            </div>
            </div>;
    } else {
      total_point = <Loading />;
    }
    var comment_count;
    if (typeof(total.comment_count) != 'undefined') {
      comment_count = <div>
            <p>コメントの数：{total.comment_count}</p>
            </div>;
    } else {
      comment_count =  <Loading />;
    }

    return (
      <div>
        <Row>
          <Col xs={12} sm={9} md={9} lg={9}>
            <h2> <a href={total.project_url} target="_blank"> {total.project_name} </a></h2>
          </Col>
          <Col xs={12} sm={3} md={3} lg={3} className="text-right">
            <div className="h3"><Button bsStyle='primary' onClick={this.props.executer.bind(/*force=*/true)}>結果を更新</Button></div>
          </Col>
        </Row>

        <Table bordered condensed >
        <tbody>
        <tr>
          <td>
            プロジェクトの評価<br/>
            {total_point}
          </td>
          <td>
            <div className="summarymessage" >
            <p>チケットの数：{total.issue_count}</p>
            <p>未対応：{total.issue_no_compatible}</p>
            <p>処理中：{total.issue_in_progress}</p>
            <p>処理済み：{total.issue_prosessed}</p>
            <p>完了：{total.issue_complete}</p>
            {comment_count}
            </div>
          </td>
        </tr>
        </tbody>
        </Table>
      </div>
    );
  }
});

module.exports = GradeTotal;
