var Rules = React.createClass({

  render: function() {
    return (
      <div className="modal fade" id="rules" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">利用規約</h4>
            </div>
            <div className="modal-body">
              <p>Project Auto Grader（以下「本サービス」といいます。）のご利用にあたっては、以下の規約（以下「本規約」といいます。）が適用されます。本サービスには、本規約のほか本サービスのご利用にあたって適用されるご利用上の注意等を定める場合があります。ご利用上の注意等と本規約が矛盾する場合には、ご利用上の注意等が優先して適用されます。</p>
              <h4>本サービスの概要</h4>
              <p>本サービスは株式会社ヌーラボ（<a href="https://nulab-inc.com/" target="_blank">https://nulab-inc.com/</a>）が提供するサービス、Backlog（<a href="http://www.backlog.jp/" target="_blank">http://www.backlog.jp/</a>）のAPIを利用したプロジェクト分析サービスです。本サービスは利用ユーザーの同意の元にBacklogからプロジェクト情報を取得・分析・表示を行います。利用ユーザーは、本サービスの利用に当たって、本サービス所定の手続き及びBacklogの認証手続きを承認する必要があります。</p>
              <h4>免責事項</h4>
              <ol>
                <li>本サービスは、本サービス独自の評価基準に基づいてプロジェクトを分析するものであり、分析結果の完全性、正確性、適合性、有効性等に関し、いかなる保証及び責任を負わないものとします。</li>
                <li>通信回線やコンピュータなどの障害によるシステムの中断・遅滞・中止・データの消失、データへの不正アクセスにより利用ユーザーに生じた損害について、本サービスに故意又は重過失がない限り、本サービスは一切責任を負わないものとします。</li>
                <li>利用ユーザーが本サービスを通じて閲覧及び取得した情報に起因して、当該利用ユーザーに損害が生じた場合、本サービスに故意又は重過失がある場合を除き、本サービスはその責任を負わないものとします。</li>
              </ol>
              <h4>個人情報の取り扱い</h4>
              <ol>
                <li>本サービスは、利用ユーザーから取得した個人情報を、本サービスの提供にのみ利用するものとします。</li>
                <li>本サービスは、個人情報保護法を遵守し、前項の個人情報を安全に管理します。</li>
              </ol>
              <p>以上</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">閉じる</button>
            </div>
          </div>
        </div>
      </div>
    );
  },

});

module.exports = Rules;
