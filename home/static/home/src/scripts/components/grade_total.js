var Table     = require('react-bootstrap').Table;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Grid      = require('react-bootstrap').Grid;
var Row       = require('react-bootstrap').Row;
var Col       = require('react-bootstrap').Col;
var Button    = require('react-bootstrap').Button;
var Popover   = require('react-bootstrap').Popover;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Loading   = require('./loading.js');

var GradeTotal = React.createClass({

  getChartData: function() {
    var chartData = [
          {
                    value: this.props.data.issue_no_compatible,
                    color:"#F7464A",
                    fillColor:"#F7464A",
                    highlight: "#FF5A5E",
                    label: "未対応 ("+ this.props.data.issue_no_compatible +"件)"
          },
          {
                    value: this.props.data.issue_in_progress,
                    color: "#FDB45C",
                    fillColor:"#FDB45C",
                    highlight: "#FFC870",
                    label: "処理中 ("+ this.props.data.issue_in_progress +"件)"
          },
          {
                    value: this.props.data.issue_prosessed,
                    color: "#46BFBD",
                    fillColor:"#46BFBD",
                    highlight: "#5AD3D1",
                    label: "処理済み ("+ this.props.data.issue_prosessed +"件)"
          },
          {
                    value: this.props.data.issue_complete,
                    color: "#949FB1",
                    fillColor:"#949FB1",
                    highlight: "#A8B3C5",
                    label: "完了 ("+ this.props.data.issue_complete +"件)"
          },
   ];
   return chartData;
  },
  
  chartOptions: function(  ){
    var chartOption = {
      //Boolean - Whether we should show a stroke on each segment
      segmentShowStroke : true,

      responsive: true,
      //String - The colour of each segment stroke
      segmentStrokeColor : "#fff",

      //Number - The width of each segment stroke
      segmentStrokeWidth : 2,

      //Number - The percentage of the chart that we cut out of the middle
      percentageInnerCutout : 50, // This is 0 for Pie charts

      //Number - Amount of animation steps
      animationSteps : 100,

      //String - Animation easing effect
      animationEasing : "easeOutBounce",

      //Boolean - Whether we animate the rotation of the Doughnut
      animateRotate : true,

      //Boolean - Whether we animate scaling the Doughnut from the centre
      animateScale : false,

      //String - A legend template
      legendTemplate : "<ul class=\"legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"color:<%=segments[i].fillColor%><%=segments[i].lineColor%>;font-size:large\">■</span>&nbsp;&nbsp;<%=segments[i].label%></li><%}%></ul>"
    };
    return chartOption;

  },

  render: function() {
    var total = this.props.data;
    var starStyle = {
      color: '#FFCA28',
    };
    var starEmptyStyle = {
      color: '#BDBDBD',
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

        <Table bordered condensed>
        <tbody>
        <tr>
          <td className="col-xs-6 col-sm-6 col-md-6 col-md-6">
            プロジェクトの評価　
              <OverlayTrigger trigger='click' placement='right' overlay={<Popover >
                複数の評価基準を用いてプロジェクト活動の評価を行った評価結果を表示しています。<br/>取得した点数に応じて、以下の評価結果を表示しています。<br/>
                A：95点以上　B：85点以上　C：70点以上　D：50以上　E：49未満
              </Popover>}>
              <a>詳細</a>
              </OverlayTrigger>
            <br/>
            {total_point}
          </td>
          <td className="col-xs-6 col-sm-6 col-md-6 col-md-6">
            <div className="col-xs-6 col-sm-6 col-md-6 col-md-6">
            課題の状態
              <canvas id="ticketchart"></canvas>
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-md-6">
              <br/>
              <div id="pieLegend"></div>
            </div>
          </td>
        </tr>
        </tbody>
        </Table>
      </div>
    );
  },

  componentDidMount: function() {
    var context = document.getElementById("ticketchart").getContext("2d");
    var graph = new Chart(context).Doughnut(this.getChartData(), this.chartOptions());
    document.getElementById("pieLegend").innerHTML = graph.generateLegend();
  }

});

module.exports = GradeTotal;
