from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_GET
from datetime import datetime
import collections

from pag import utils
from .models import Grade
from home.models import Task


@require_GET
def projects(request):
    try:
        backlog = utils.backlog(request, request.session['space'], token=request.session['token'])
        projects = backlog.get_projects().json()
    except KeyError:
        projects = []
    return JsonResponse(projects, safe=False)


@require_GET
def myself(request):
    try:
        backlog = utils.backlog(request, request.session['space'], token=request.session['token'])
        user = backlog.get_myself().json()
    except KeyError:
        user = []
    return JsonResponse(user, safe=False)


@require_GET
def summary(request, project_id):
    try:
        backlog             = utils.backlog(request, request.session['space'], token=request.session['token'])
        project_detail      = backlog.get_projects_detail(project_id).json()
        backlog_url         = backlog.get_host()
        project_url         = backlog_url + "/projects/" + project_detail["projectKey"]
        issue_all_count     = backlog.get_count_issues(project_id).json()["count"]
        issue_no_compatible = backlog.get_count_issues_status(project_id,"1").json()["count"]
        issue_in_progress   = backlog.get_count_issues_status(project_id,"2").json()["count"]
        issue_prosessed     = backlog.get_count_issues_status(project_id,"3").json()["count"]
        issue_complete      = backlog.get_count_issues_status(project_id,"4").json()["count"]
        summary_key         = ["project_id","project_name", "project_url", "issue_count", "issue_no_compatible", "issue_in_progress", "issue_prosessed", "issue_complete"]
        result_summary      = utils.set_Dict(summary_key, [project_id, project_detail["name"], project_url, issue_all_count, issue_no_compatible, issue_in_progress, issue_prosessed, issue_complete])
    except KeyError:
        result_summary = []
    return JsonResponse(result_summary, safe=False)


@require_GET
def grade(request, project_id):
    try:
        backlog = utils.backlog(request, request.session['space'], token=request.session['token'])

        cache = Grade().find_by_project_id(project_id)
        if cache:
            try:
                f = request.GET['force']
                cache.delete()
            except KeyError:
                return JsonResponse(cache.data, safe=False)

        backlog_url             = backlog.get_host()
        project_detail          = backlog.get_projects_detail(project_id).json()
        project_name            = project_detail["name"]
        project_url             = backlog_url + "/projects/" + project_detail["projectKey"]
        users                   = backlog.get_users(project_id).json()
        user_comment_count      = collections.defaultdict(int)
        user_update_count       = collections.defaultdict(int)
        user_comment_chars      = collections.defaultdict(int)
        user_create_issue_count = collections.defaultdict(int)

        issue_all_count     = backlog.get_count_issues(project_id).json()["count"]
        issue_no_compatible = backlog.get_count_issues_status(project_id,"1").json()["count"]
        issue_in_progress   = backlog.get_count_issues_status(project_id,"2").json()["count"]
        issue_prosessed     = backlog.get_count_issues_status(project_id,"3").json()["count"]
        issue_complete      = backlog.get_count_issues_status(project_id,"4").json()["count"]

        # set dictionary key
        advice_key        = ["message", "issues"]
        advice_issues_key = ["issue_key", "issue_summary", "issue_url"]
        detail_key        = ["title", "count", "all_count", "point", "advice"]
        summary_key       = ["point", "issue_count", "comment_count", "project_id", "project_name", "project_url", "issue_no_compatible", "issue_in_progress", "issue_prosessed", "issue_complete"]
        grade_key         = ["summary", "detail", "users"]
        users_key         = ["name", "created", "assigned", "closed", "in_progress", "no_closed", "comments_count", "comments_length", "updated"]

        all_issue_count = backlog.get_count_issues(project_id).json()["count"]
        limit = 100
        if all_issue_count >= limit:
            try:
                task = Task.objects.get(space=request.session['space'], project_id=project_id)
            except: # XXX Want to catch "DoesNotExist" exception...
                Task(space=request.session['space'], token=request.session['token'], project_id=project_id).save()

            summary = {"project_id": project_id}
            error   = {"message": "チケット数が多いためバックグラウンドで実行しています。30分後を目安にもう一度ご確認ください。"}
            return JsonResponse({"summary": summary, "error": error})

        c = int(all_issue_count / 100)
        pages = c if (all_issue_count % 100) == 0 else c + 1

        issues = []
        offset = 0
        for n in range(0, pages):
            issues += backlog.get_issues(project_id, offset).json()
            offset += 100

        # grade data initialize
        detailed_issue_count   = 0
        detailed_comment_count = 0
        all_comment_count      = 0

        closed_issue_count                 = 0
        closed_issue_with_comment_count    = 0
        closed_issue_with_atime_count      = 0
        closed_issue_with_resolution_count = 0

        readied_issue_count                 = 0
        readied_issue_with_ddate_count      = 0
        readied_issue_with_assigner_count   = 0
        readied_issue_with_etime_count      = 0
        readied_issue_with_milestones_count = 0

        expired_issue_count        = 0
        expired_closed_issue_count = 0

        # advice data initialize
        adv_issues_little_detailed       = []
        adv_issues_little_comment        = []
        adv_closed_issues_no_comment     = []
        adv_readied_issue_no_duedate     = []
        adv_readied_issues_no_estimated  = []
        adv_expired_closed_issues        = []
        adv_closed_issues_no_actualHours = []
        adv_readied_issues_no_assigner   = []
        adv_closed_issues_no_resolution  = []
        adv_readied_issues_no_milestones = []

        for issue in issues:
            user_id = issue["createdUser"]["id"]
            user_create_issue_count[user_id] += 1
            user_comment_chars[user_id] += len(issue["summary"])
            user_comment_chars[user_id] += len(issue["description"])

            comments = backlog.get_comments(issue["id"]).json()

            for comment in comments:
                user_id = comment["createdUser"]["id"]
                user_comment_count[user_id] += 1 if comment["content"] else 0
                user_update_count[user_id] += 1
                user_comment_chars[user_id] += len(comment["content"]) if comment["content"] else 0
                point = utils.get_linear_point(len(comment["content"])) if comment["content"] else 0
                # sum comment
                detailed_comment_count += point
                if point > 0 and point < 1: adv_issues_little_comment.append(utils.set_Dict(advice_issues_key, 
                        [issue["issueKey"]+"#comment-"+str(comment["id"]), issue["summary"], 
                            str(backlog_url)+"/view/"+issue["issueKey"]+"#comment-"+str(comment["id"])]))
                all_comment_count += 1 if comment["content"] else 0

            # sum detailed issue
            point = utils.get_linear_point(len(issue["description"]))
            if point < 1: adv_issues_little_detailed.append(utils.set_Dict( advice_issues_key,
                [issue["issueKey"], issue["summary"], str(backlog_url)+"/view/"+issue["issueKey"]]))
            detailed_issue_count += point

            if issue["status"]["id"] == 4:
                closed_issue_count += 1
                if len(comments) >= 1: 
                    closed_issue_with_comment_count += 1
                else:
                    adv_closed_issues_no_comment.append(utils.set_Dict(advice_issues_key, 
                        [issue["issueKey"], issue["summary"], str(backlog_url)+"/view/"+issue["issueKey"]]))
                if not issue["actualHours"] is None: 
                    closed_issue_with_atime_count += 1
                else:
                    adv_closed_issues_no_actualHours.append(utils.set_Dict(advice_issues_key,
                        [issue["issueKey"], issue["summary"], str(backlog_url)+"/view/"+issue["issueKey"]]))
                if not issue["resolution"] is None: 
                    closed_issue_with_resolution_count += 1
                else:
                    adv_closed_issues_no_resolution.append(utils.set_Dict(advice_issues_key,
                        [issue["issueKey"], issue["summary"], str(backlog_url)+"/view/"+issue["issueKey"]]))

            if not issue["startDate"] is None:
                readied_issue_count += 1
                if not issue["dueDate"] is None: 
                    readied_issue_with_ddate_count += 1 
                else:
                    adv_readied_issue_no_duedate.append(utils.set_Dict(advice_issues_key,
                        [issue["issueKey"], issue["summary"], str(backlog_url)+"/view/"+issue["issueKey"]]))
                if not issue["assignee"] is None: 
                    readied_issue_with_assigner_count += 1
                else:
                    adv_readied_issues_no_assigner.append(utils.set_Dict(advice_issues_key,
                        [issue["issueKey"], issue["summary"], str(backlog_url)+"/view/"+issue["issueKey"]]))
                if not issue["estimatedHours"] is None: 
                    readied_issue_with_etime_count += 1
                else:
                    adv_readied_issues_no_estimated.append(utils.set_Dict(advice_issues_key,
                        [issue["issueKey"], issue["summary"], str(backlog_url)+"/view/"+issue["issueKey"]]))

                if not len(issue["milestone"]) == 0 : 
                    readied_issue_with_milestones_count += 1
                else:
                    adv_readied_issues_no_milestones.append(utils.set_Dict(advice_issues_key,
                        [issue["issueKey"], issue["summary"], str(backlog_url)+"/view/"+issue["issueKey"]]))

            if not issue["dueDate"] is None and datetime.strptime(issue["dueDate"], '%Y-%m-%dT%H:%M:%SZ') < datetime.today(): 
              expired_issue_count += 1
              if issue["status"]["id"] == 4: 
                  expired_closed_issue_count += 1 
              else:
                  adv_expired_closed_issues.append(utils.set_Dict(advice_issues_key,
                        [issue["issueKey"], issue["summary"], str(backlog_url)+"/view/"+issue["issueKey"]]))

        # users row
        users_row = []
        for user in users:
            if user["roleType"] != 6: #一般ユーザ
                user_id = user["id"]
                all_count   = backlog.get_count_issues_assigned(project_id, user["id"]).json()["count"]
                in_progress = backlog.get_count_issues_assigned_status(project_id, user["id"], "2").json()["count"]
                closed      = backlog.get_count_issues_assigned_status(project_id, user["id"], "4").json()["count"]
                no_closed   = all_count - closed

                users_row.append([
                    user["name"],
                    user_create_issue_count[user_id],
                    all_count,
                    closed,
                    in_progress,
                    no_closed,
                    user_comment_count[user_id],
                    user_comment_chars[user_id],
                    user_update_count[user_id] ])

        result_users = [""] * len(users_row)
        for i in range(len(users_row)):
            result_users[i] = utils.set_Dict(users_key, users_row[i])

        point_detailed_issue                     = utils.get_point(detailed_issue_count,                all_issue_count,     10)
        point_detailed_comment                   = utils.get_point(detailed_comment_count,              all_comment_count,   10)
        point_closed_issue_with_comment          = utils.get_point(closed_issue_with_comment_count,     closed_issue_count,  10)
        point_readied_issue_with_date            = utils.get_point(readied_issue_with_ddate_count,      readied_issue_count, 10)
        point_readies_issue_with_estimated_hours = utils.get_point(readied_issue_with_etime_count,      readied_issue_count, 10)
        point_expired_and_closed_issue           = utils.get_point(expired_closed_issue_count,          expired_issue_count, 10)
        point_closed_issue_with_actual_hours     = utils.get_point(closed_issue_with_atime_count,       closed_issue_count,  10)
        point_readies_issue_with_assigner        = utils.get_point(readied_issue_with_assigner_count,   readied_issue_count, 10)
        point_closed_issue_with_resolution       = utils.get_point(closed_issue_with_resolution_count,  closed_issue_count,  10)
        point_readied_issue_with_milestones      = utils.get_point(readied_issue_with_milestones_count, readied_issue_count, 10)

        advice_message_detailed              = "チケット開始時の詳細を十分に書いて、チケットの意図を正しく伝えましょう"
        advice_message_comment               = "コメントには十分な量の文字を記入して、有用な情報を残しましょう"
        advice_message_closed_no_comment     = "チケットを完了する前にコメントを残して、作業した内容を残しましょう"
        advice_message_no_duedate            = "作業開始前に見積もりを完了させましょう"
        advice_message_no_estimated          = "作業開始前に見積もりを完了させましょう"
        advice_message_expired_closed_issues = "期日を過ぎたタスクを更新しましょう"
        advice_message_no_actualHours        = "終了したチケットに実績時間を残して、次回作業を行う際の参考にしましょう"
        advice_message_no_assigner           = "開始したチケットへ担当者をアサインして、担当者を明確にしましょう"
        advice_message_no_resolution         = "終了したチケットに完了理由をを入力して、 完了理由を明確にしましょう"
        advice_message_no_milestones         = "チケットをマイルストーンへ関連づけ、チケットがプロジェクト上のどのステップに属するか明確にしましょう"

        if point_detailed_issue == 10:
            advice_message_detailed = "チケット開始時の詳細に十分な文字が書かれています。この調子でチケットの意図を正しく伝えていきましょう"
        if point_detailed_comment == 10:
            advice_message_comment = "コメントには十分な量の文字を記入されています。この調子でコメントに有用な情報を残しましょう"                                       
        if point_closed_issue_with_comment == 10:
            advice_message_closed_no_comment = "チケットを完了する前にコメントが残されており、作業内容が記録されています"                                   
        if point_readied_issue_with_date == 10:
            advice_message_no_duedate = "作業開始前に期限日が設定されており、見積もりが完了しています"
        if point_readies_issue_with_estimated_hours == 10:
            advice_message_no_estimated = "作業開始前に予定時間が設定されており、見積もりが完了しています"
        if point_expired_and_closed_issue == 10:
            advice_message_expired_closed_issues = "期日を過ぎたタスクはありません"
        if point_closed_issue_with_actual_hours == 10:
            advice_message_no_actualHours = "終了したチケットに実績時間が記録されています"
        if point_readies_issue_with_assigner == 10:
            advice_message_no_assigner = "開始したチケットへ担当者がアサインされており、担当者が明確になっています"
        if point_closed_issue_with_resolution == 10:
            advice_message_no_resolution = "終了したチケットに完了理由が記入されており、完了理由が明確になっています"
        if point_readied_issue_with_milestones == 10:
            advice_message_no_milestones = "チケットをマイルストーンへ関連づけられています" 

        advice_rows = [
            ["", []],
            [advice_message_detailed,          adv_issues_little_detailed],
            [advice_message_comment,           adv_issues_little_comment],
            [advice_message_closed_no_comment, adv_closed_issues_no_comment],
            [advice_message_no_duedate,        adv_readied_issue_no_duedate],
            [advice_message_no_estimated,      adv_readied_issues_no_estimated],
            [advice_message_no_actualHours,    adv_expired_closed_issues],
            [advice_message_no_actualHours,    adv_closed_issues_no_actualHours],
            [advice_message_no_assigner,       adv_readied_issues_no_assigner],
            [advice_message_no_resolution,     adv_closed_issues_no_resolution],
            [advice_message_no_milestones,     adv_readied_issues_no_milestones]
        ]

        result_advices = [""] * len(advice_rows)
        for i in range(len(advice_rows)):
            result_advices[i] = utils.set_Dict(advice_key,advice_rows[i])

        grade_rows = [
            utils.get_row("課題の詳細を詳しく書く",       detailed_issue_count,                 all_issue_count,     point_detailed_issue,                     result_advices[1]),
            utils.get_row("コメントを詳しく書く",         detailed_comment_count,               all_comment_count,   point_detailed_comment,                   result_advices[2]),
            utils.get_row("完了した課題にコメントを残す", closed_issue_with_comment_count,      closed_issue_count,  point_closed_issue_with_comment,          result_advices[3]),
            utils.get_row("期限日を設定する",             readied_issue_with_ddate_count,       readied_issue_count, point_readied_issue_with_date,            result_advices[4]),
            utils.get_row("予定時間を見積もる",           readied_issue_with_etime_count,       readied_issue_count, point_readies_issue_with_estimated_hours, result_advices[5]),
            utils.get_row("期限までに完了させる",         expired_closed_issue_count,           expired_issue_count, point_expired_and_closed_issue,           result_advices[6]),
            utils.get_row("実績時間を記録する",           closed_issue_with_atime_count,        closed_issue_count,  point_closed_issue_with_actual_hours,     result_advices[7]),
            utils.get_row("担当者を設定する",             readied_issue_with_assigner_count,    readied_issue_count, point_readies_issue_with_assigner,        result_advices[8]),
            utils.get_row("完了理由を入れる",             closed_issue_with_resolution_count,   closed_issue_count,  point_closed_issue_with_resolution,       result_advices[9]),
            utils.get_row("マイルストーンを活用する",     readied_issue_with_milestones_count,  readied_issue_count, point_readied_issue_with_milestones,      result_advices[10])
        ]

        result_detail = [""] * len(grade_rows)
        for i in range(len(grade_rows)):
            result_detail[i] = utils.set_Dict(detail_key, grade_rows[i])

        total_point = sum([
            point_detailed_issue,
            point_detailed_comment,
            point_closed_issue_with_comment,
            point_readied_issue_with_date,
            point_readies_issue_with_estimated_hours,
            point_expired_and_closed_issue,
            point_closed_issue_with_actual_hours,
            point_readies_issue_with_assigner,
            point_closed_issue_with_resolution,
            point_readied_issue_with_milestones,
        ])

        result_summary = utils.set_Dict(summary_key, [
            int(total_point),
            all_issue_count,
            all_comment_count,
            project_id,
            project_name,
            project_url,
            issue_no_compatible,
            issue_in_progress,
            issue_prosessed,
            issue_complete
        ])

        result_grade = utils.set_dict(grade_key, [result_summary, result_detail, result_users])
        grade(data=result_grade).save() # save cache

    except KeyError:
        result_grade = []

    return JsonResponse(result_grade, safe=False)

