/**
 * 问卷功能
 *
 *  Created by shanglt on 2017/3/27.
 */
$(function () {

    function errorTip(msg) {
        $('#questionnaireSuccess, #questionnaireFail').hide();
        $('#questionnaireFail').text(msg).show();
    }

    function successTip(msg) {
        $('#questionnaireSuccess, #questionnaireFail').hide();
        $('#questionnaireSuccess').text(msg).show();
    }

    // 提交问卷
    $(document).on("click", '#submitQuestionnaire', function (e) {
        $('#submitQuestionnaire').attr('disabled', true);

        var questionnaireId = $('#questionnaire').attr('questionnaireId');

        // 是否有没有回答的问题
        var hasNotAnswerSubject = false;
        var subjectsAnswer = [];
        $('div[name="subject"]').each(function () {
            var $t = $(this);

            var subjectId = $t.attr('subjectId');
            var subjectParam = {
                subjectId: subjectId
            };

            var type = $(this).attr('type');
            if (type == 0) {
                var selectedOptionId = $t.find('input[type="radio"][name="' + subjectId + '"]:checked').val();
                if (!selectedOptionId) {
                    hasNotAnswerSubject = true;
                    return;
                }
                subjectParam.selectedOptionId = selectedOptionId;
            } else if (type == 1) {
                var selectedOptionIds = [];
                $t.find('input[name="' + subjectId + '"]:checked').each(function () {
                    selectedOptionIds.push($(this).val());
                });

                // 多选，必须选择两个以上
                if (selectedOptionIds.length < 1) {
                    hasNotAnswerSubject = true;
                    return;
                }

                subjectParam.selectedOptionIds = selectedOptionIds.toString();
            } else if (type == 2) {
                var c = $.trim($t.find('textarea[name="qASubject"]').val());
                if (!c) {
                    hasNotAnswerSubject = true;
                    return;
                }
                subjectParam.answerContent = c;
            }

            subjectsAnswer.push(subjectParam);
        });

        if (hasNotAnswerSubject) {
            errorTip('您尚有部分题目未回答，请检查');
            $('#submitQuestionnaire').attr('disabled', false);
            return;
        }

        var params = {
            questionnaireid: questionnaireId,
            answers: JSON.stringify({
                subjectsAnswer: subjectsAnswer
            })
        };

        $.ajax({
            url: '//eva.csslcloud.net/api/questionnaire/submit',
            type: "GET",
            dataType: "jsonp",
            timeout: 5000,
            data: params,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                if (data.success) {
                    // 答卷成功
                    successTip('答卷提交成功');

                    setTimeout(function () {
                        $("#questionnaire").hide("slow", function () {
                            $('.video-box').css({'width': '100%', 'height': '100%'});
                            $(this).remove();
                        });
                    }, 1500);
                    return;
                }

                if (data.errorCode == 400) {
                    confirmAndCloseQuestionnaire(questionnaireId);
                } else {
                    errorTip(data.msg);
                }
                $('#submitQuestionnaire').attr('disabled', false);
            },
            error: function (xhr, status, error) {
                if (questionnaireId === $('#questionnaire').attr('questionnaireId')) {
                    errorTip('网络异常，提交失败，请重试');
                    $('#submitQuestionnaire').attr('disabled', false);
                }
            }
        });
    });

    // 关闭问卷
    $(document).on("click", '#closeQuestionnaire', function (e) {
        $('#questionnaire').remove();
        $('.video-box').css({'width': '100%', 'height': '100%'});
    });
});

DWLive.onQuestionnairePublish = function (data) {
    // 关闭弹出框
    $('#questionnaire, #questionnaireTip').remove();
    $('.video-box').css({'width': '100%', 'height': '100%'});

    $.ajax({
        url: '//eva.csslcloud.net/api/questionnaire/info',
        type: "GET",
        dataType: "jsonp",
        data: {
            questionnaireid: data.questionnaireId
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            if (!data.success) {
                return;
            }

            var questionnaire = data.datas.questionnaire;
            $.each(questionnaire.subjects, function (index, subject) {
                subject.subjectIndex = subject.index + 1;

                if (subject.type == 0) {
                    subject.isSingleSubject = true;
                    subject.typeDesc = '单选';
                }

                if (subject.type == 1) {
                    subject.isMultipleSubject = true;
                    subject.typeDesc = '多选';
                }

                if (subject.type == 2) {
                    subject.isQASubject = true;
                    subject.typeDesc = '问答';
                }

                if (subject.options) {
                    $.each(subject.options, function (optionIndex, option) {
                        option.indexDesc = String.fromCharCode(65 + option.index);
                    });

                    // 选项排序
                    subject.options.sort(function (o1, o2) {
                        return o1.index - o2.index;
                    });
                }
            });

            // 问题排序
            questionnaire.subjects.sort(function (s1, s2) {
                return s1.index - s2.index;
            });

            $('body').append(Handlebars.getTemplate('questionnaire')(questionnaire));
            // 缩小播放器
            $('.video-box').css({'width': 1, 'height': 1});
        }
    });
};

Handlebars.getTemplate = function (name) {
    if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
        $.ajax({
            url: 'js/templates/' + name + '.hbs',
            success: function (data) {
                if (Handlebars.templates === undefined) {
                    Handlebars.templates = {};
                }
                Handlebars.templates[name] = Handlebars.compile(data);
            },
            dataType: "text",
            async: false,
            cache: true
        });
    }

    return Handlebars.templates[name];
};


// 终止时，未提交问卷用户弹窗失败，则在用户提交问卷时，弹窗提示：问卷已停止回收，提交将不记录数据。点击确定后关闭问卷；
DWLive.onQuestionnairePublishStop = function (data) {
    confirmAndCloseQuestionnaire(data.questionnaireId);
};


function confirmAndCloseQuestionnaire(questionnaireId) {
    var $q = $('div[questionnaireid="' + questionnaireId + '"]');
    if (!$q.length) {
        return;
    }

    $('body').append(Handlebars.getTemplate('confirm')({
        id: 'questionnaireTip',
        msg: '问卷已停止回收，点击确定后关闭问卷',
        fix: 'fixQuestionnaire("' + questionnaireId + '");'
    }));
}

function fixQuestionnaire(questionnaireId) {
    $('#questionnaireTip').remove();
    $('.video-box').css({'width': '100%', 'height': '100%'});
    $('div[questionnaireid="' + questionnaireId + '"]').remove();
}