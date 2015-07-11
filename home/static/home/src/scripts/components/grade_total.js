var Table     = require('react-bootstrap').Table;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Grid       = require('react-bootstrap').Grid;
var Row       = require('react-bootstrap').Row;
var Col       = require('react-bootstrap').Col;
var Button    = require('react-bootstrap').Button;

var GradeTotal = React.createClass({
  render: function() {
    var total = this.props.data;
    var starStyle = {
      color: '#FFCC00',
    };
    var starEmptyStyle = {
      color: '#cccccc',
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
        color: '#CD5629',
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
        color: '#CD5629',
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
        color: '#FFCC00',
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
        color: '#00ff00',
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
        color: '#00ff00',
      };
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
            grade
            <div style={summaryGradeStyle} >
              <big><strong> {summaryIcon} {summaryGrade} ({total.point}%) </strong></big>
              <br/>
            </div>
              {summaryStar1}
              {summaryStar2}
              {summaryStar3}
              {summaryStar4}
              {summaryStar5}
          </td>
          <td>
            チケットの数
            <br/>
            <big>{total.issue_count}</big>
            <br/>
            未:{total.issue_no_compatible}　
            処:{total.issue_in_progress}　
            済:{total.issue_prosessed}　
            完:{total.issue_complete}
          </td>
          <td>
            コメントの数
            <br/>
            <big>{total.comment_count}</big>
          </td>
        </tr>
        </tbody>
        </Table>
      </div>
    );
  }
});

module.exports = GradeTotal;
