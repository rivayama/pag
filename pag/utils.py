import logging

from pag.libs.backloglib2 import Backlog

logger = logging.getLogger('django-site')

def debug(msg, name=None):
    if name:
        msg = "%s = %s" % (name, msg)
    logger.debug(msg)

def backlog(request, space, state=None, token=None):
    def token_updater(token):
        request.session['token'] = token
    return Backlog(space, state=state, token=token, token_updater=token_updater)


def get_linear_point(strcount, strminimum=100, strmax=400, too_much=1000):
    point = 0
    if strminimum <= strcount and strcount <= strmax:
        point = 1
    elif too_much < strcount:
        point = 0
    elif strcount < strminimum:
        point = _get_linear_point(strcount, strminimum)
    elif strcount > strmax:
        point = 1 -_get_linear_point(strcount - strmax, too_much - strmax)
    return point

def _get_linear_point(strcount, amount):
    return round(strcount / amount,1)

def get_row(title, numer, denom, max_point):
    try:
        point = max_point * (numer / denom)
    except ZeroDivisionError:
        point = 0
    return [title, numer, denom, point]

def append_imp_issues(issue_list, append_issue, point):
    if point < 1: issue_list.append(append_issue)
    return issue_list

def _get_grade(self, project_id):
    # get project issue
    issues = Backlog.get_issues(self, project_id).json()

    # grade variable
    detailed_issue_count = 0
    all_issue_count = Backlog.get_count_issues(self, project_id).json()["count"]

    detailed_comment_count = 0
    all_comment_count = 0

    closed_issue_count = 0
    closed_issue_with_comment_count = 0
    closed_issue_with_atime_count = 0
    closed_issue_with_resolution_count = 0

    readied_issue_count = 0
    readied_issue_with_ddate_count = 0
    readied_issue_with_assigner_count = 0
    readied_issue_with_etime_count = 0
    readied_issue_with_milestones_count = 0

    expired_issue_count = 0
    expired_closed_issue_count = 0

    # advice variable
    imp_detailed_issues = []
    imp_comment_issues = []
    imp_closed_issues_comment = []
    imp_readied_issue_dueDate = []
    imp_readied_issues_estimated = []
    imp_expired_closed_issues = []
    imp_closed_actual_hours = []
    imp_readied_issues_assigner = []
    imp_closed_issues_resolution = []
    imp_readied_issues_milestones = []


    # issue loop
    for issue in issues:
        # # issue
        # user_id = issue["created_user"]["id"]
        # user_create_issue_count[user_id] += 1
        # # issue as comments
        # user_comment_count[user_id] += 1
        # user_comment_chars[user_id] += len(issue["summary"])
        # user_comment_chars[user_id] += len(issue["description"])

        # get comment
        comments = Backlog.get_comment(self, issue["id"]).json()
        for comment in comments:
            point = get_linear_point(len(comment["content"]))
            detailed_comment_count += point
            # imp_comment_issues = list(set(append_imp_issues(imp_comment_issues, issue["issueKey"], point)))
            imp_comment_issues = append_imp_issues(imp_comment_issues, issue["issueKey"], point)
            all_comment_count += 1

        point = get_linear_point(len(issue["description"]))
        detailed_issue_count += point
        imp_detailed_issues = append_imp_issues(imp_detailed_issues, issue["issueKey"], point)

        if issue["status"]["id"] == 4:
            closed_issue_count += 1
            if len(comments) >= 1: 
                closed_issue_with_comment_count += 1
            else:
                imp_closed_issues_comment.append(issue["issueKey"])
            if issue["actualHours"] is None: 
                closed_issue_with_atime_count += 1
            else:
                imp_closed_actual_hours.append(issue["issueKey"])
            # if len(issue["resolutions"]) == 0: 
            #     closed_issue_with_resolution_count += 1
            # else:
            #     imp_closed_issues_resolution.append(issue["issueKey"])

        if issue["startDate"] is None:
            readied_issue_count += 1
            if not issue["dueDate"] is None: 
                readied_issue_with_ddate_count += 1 
            else:
                imp_readied_issue_dueDate.append(issue["issueKey"])
            if not issue["assignee"] is None: 
                readied_issue_with_assigner_count += 1
            else:
                imp_readied_issues_assigner.append(issue["issueKey"])
            if not issue["estimatedHours"] is None: 
                readied_issue_with_etime_count += 1
            else:
                imp_readied_issues_estimated.append(issue["issueKey"])

            if not issue["milestone"] is None: 
                readied_issue_with_milestones_count += 1
            else:
                imp_readied_issues_milestones.append(issue["issueKey"])

    if not issue["dueDate"] is None and issue["dueDate"] < datetime.today():
      expired_issue_count += 1
      if issue["status"]["id"] == 4: 
          expired_closed_issue_count += 1 
      else:
          imp_expired_closed_issues.append(issue["issueKey"])

    # out put data
    gradeRows = [
            get_row("Detailed issue",                     detailed_issue_count,                 all_issue_count,     10),
            get_row("Detailed comment",                   detailed_comment_count,               all_comment_count,   10),
            get_row("Closed issue with comment",          closed_issue_with_comment_count,      closed_issue_count,  10),
            get_row("Readied issue with due date",        readied_issue_with_ddate_count,       readied_issue_count, 10),
            get_row("Readied issue with estimated hours", readied_issue_with_etime_count,       readied_issue_count, 10),
            get_row("Expired and closed issue",           expired_closed_issue_count,           expired_issue_count, 10),
            get_row("Closed issue with actual hours",     closed_issue_with_atime_count,        closed_issue_count,  10),
            get_row("Readied issue with assigner",        readied_issue_with_assigner_count,    readied_issue_count, 10),
            get_row("Closed issue with resolution",       closed_issue_with_resolution_count,   closed_issue_count,  10),
            get_row("Readied issue with milestones",      readied_issue_with_milestones_count,  readied_issue_count, 10)
            ]
    keyList = ["title","count","all_count","point"]
    gradeDict = [""] * len(gradeRows)
    for i in range(len(gradeRows)):
      gradeDict[i] = {}
      for j in range(len(keyList)):
        gradeDict[i][keyList[j]] = gradeRows[i][j]

    imp_comment_issues = list(set(imp_comment_issues))
    adviceRows = [
            ["もっと詳細を詳細に書こう", imp_detailed_issues],
            ["もう少し詳しくコメントを書いてあげよう",imp_comment_issues],
            ["終了したチケットにコメントを残そう",imp_closed_issues_comment],
            ["期限日を入力しよう",imp_readied_issue_dueDate],
            ["実績時間を入力しよう",imp_readied_issues_estimated],
            ["期限を過ぎているタスクを終了しよう",imp_expired_closed_issues],
            ["実績時間を入力しよう",imp_closed_actual_hours],
            ["チケットへ担当者をアサインしよう",imp_readied_issues_assigner],
            ["終了したチケットに完了理由をを入力しよう",imp_closed_issues_resolution],
            ["チケットをマイルストーンへ関連づけよう",imp_readied_issues_milestones]
            ]

    keyList = ["message","issues"]
    adviceDict = [""] * len(adviceRows)
    for i in range(len(adviceRows)):
      adviceDict[i] = {}
      for j in range(len(keyList)):
        adviceDict[i][keyList[j]] = adviceRows[i][j]

    result = [{"grade" : gradeDict }, {"advice" : adviceDict }]
    return result


