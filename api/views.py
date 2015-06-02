from django.http import JsonResponse
from django.views.decorators.http import require_GET
from pag import utils
from datetime import datetime

@require_GET
def projects(request):
    try:
        backlog = utils.backlog(request, request.session['space'], token=request.session['token'])
        projects = backlog.get_projects().json()
    except KeyError:
        projects = []
    return JsonResponse(projects, safe=False)


@require_GET
def grade(request, project_id):
    try:
        backlog = utils.backlog(request, request.session['space'], token=request.session['token'])

        # get project issue
        issues = backlog.get_issues(project_id).json()

        # grade data initialize
        detailed_issue_count = 0
        all_issue_count = backlog.get_count_issues(project_id).json()["count"]

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

        # advice data initialize
        adv_issues_little_detailed = []
        adv_issues_little_comment = []
        adv_closed_issues_no_comment = []
        adv_readied_issue_no_duedate = []
        adv_readied_issues_no_estimated = []
        adv_expired_closed_issues = []
        adv_closed_issues_no_actualHours = []
        adv_readied_issues_no_assigner = []
        adv_closed_issues_no_resolution = []
        adv_readied_issues_no_milestones = []

        for issue in issues:
            # get comment
            comments = backlog.get_comment(issue["id"]).json()
            for comment in comments:
                point = utils.get_linear_point(len(comment["content"])) if comment["content"] else 0
                detailed_comment_count += point
                adv_issues_little_comment = utils.append_adv_issues(adv_issues_little_comment, issue["issueKey"]+"#comment-"+str(comment["id"]), point)
                all_comment_count += 1

            point = utils.get_linear_point(len(issue["description"]))
            detailed_issue_count += point
            adv_issues_little_detailed = utils.append_adv_issues(adv_issues_little_detailed, issue["issueKey"], point)

            if issue["status"]["id"] == 4:
                closed_issue_count += 1
                if len(comments) >= 1: 
                    closed_issue_with_comment_count += 1
                else:
                    adv_closed_issues_no_comment.append(issue["issueKey"])
                if issue["actualHours"] is None: 
                    closed_issue_with_atime_count += 1
                else:
                    adv_closed_issues_no_actualHours.append(issue["issueKey"])
                if not issue["resolution"] is None: 
                    closed_issue_with_resolution_count += 1
                else:
                    adv_closed_issues_no_resolution.append(issue["issueKey"])

            if not issue["startDate"] is None:
                readied_issue_count += 1
                if not issue["dueDate"] is None: 
                    readied_issue_with_ddate_count += 1 
                else:
                    adv_readied_issue_no_duedate.append(issue["issueKey"])
                if not issue["assignee"] is None: 
                    readied_issue_with_assigner_count += 1
                else:
                    adv_readied_issues_no_assigner.append(issue["issueKey"])
                if not issue["estimatedHours"] is None: 
                    readied_issue_with_etime_count += 1
                else:
                    adv_readied_issues_no_estimated.append(issue["issueKey"])

                if not len(issue["milestone"]) == 0 : 
                    readied_issue_with_milestones_count += 1
                else:
                    adv_readied_issues_no_milestones.append(issue["issueKey"])

            if not issue["dueDate"] is None and datetime.strptime(issue["dueDate"], '%Y-%m-%dT%H:%M:%SZ') < datetime.today(): 
              expired_issue_count += 1
              if issue["status"]["id"] == 4: 
                  expired_closed_issue_count += 1 
              else:
                  adv_expired_closed_issues.append(issue["issueKey"])

        # out put data
        gradeRows = [
                utils.get_row("Detailed issue",                     detailed_issue_count,                 all_issue_count,     10),
                utils.get_row("Detailed comment",                   detailed_comment_count,               all_comment_count,   10),
                utils.get_row("Closed issue with comment",          closed_issue_with_comment_count,      closed_issue_count,  10),
                utils.get_row("Readied issue with due date",        readied_issue_with_ddate_count,       readied_issue_count, 10),
                utils.get_row("Readied issue with estimated hours", readied_issue_with_etime_count,       readied_issue_count, 10),
                utils.get_row("Expired and closed issue",           expired_closed_issue_count,           expired_issue_count, 10),
                utils.get_row("Closed issue with actual hours",     closed_issue_with_atime_count,        closed_issue_count,  10),
                utils.get_row("Readied issue with assigner",        readied_issue_with_assigner_count,    readied_issue_count, 10),
                utils.get_row("Closed issue with resolution",       closed_issue_with_resolution_count,   closed_issue_count,  10),
                utils.get_row("Readied issue with milestones",      readied_issue_with_milestones_count,  readied_issue_count, 10)
                ]
        keyList = ["title","count","all_count","point"]
        result_grade = [""] * len(gradeRows)
        for i in range(len(gradeRows)):
          result_grade[i] = {}
          for j in range(len(keyList)):
            result_grade[i][keyList[j]] = gradeRows[i][j]

        adv_issues_little_comment = list(set(adv_issues_little_comment))
        adviceRows = [
                ["もっと詳細を詳細に書こう",                 adv_issues_little_detailed],
                ["もう少し詳しくコメントを書いてあげよう",   adv_issues_little_comment],
                ["終了したチケットにコメントを残そう",       adv_closed_issues_no_comment],
                ["期限日を入力しよう",                       adv_readied_issue_no_duedate],
                ["実績時間を入力しよう",                     adv_readied_issues_no_estimated],
                ["期限を過ぎているタスクを終了しよう",       adv_expired_closed_issues],
                ["実績時間を入力しよう",                     adv_closed_issues_no_actualHours],
                ["チケットへ担当者をアサインしよう",         adv_readied_issues_no_assigner],
                ["終了したチケットに完了理由をを入力しよう", adv_closed_issues_no_resolution],
                ["チケットをマイルストーンへ関連づけよう",   adv_readied_issues_no_milestones]
                ]

        keyList = ["message","issues"]
        result_advice = [""] * len(adviceRows)
        for i in range(len(adviceRows)):
          result_advice[i] = {}
          for j in range(len(keyList)):
            result_advice[i][keyList[j]] = adviceRows[i][j]

        result = [{"grade": result_grade}, {"advice": result_advice}]
    except KeyError:
        result = []
    return JsonResponse(result, safe=False)

