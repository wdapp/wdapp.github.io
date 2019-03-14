/**
 * 问卷功能
 *
 *  Created by shanglt on 2017/3/27.
 */
$(function () {

    function errorTip(msg) {
        $("#questionnaireSuccess, #questionnaireFail").hide();
        $("#questionnaireFail").text(msg).show();
    }

    function successTip(msg) {
        $("#questionnaireSuccess, #questionnaireFail").hide();
        $("#questionnaireSuccess").text(msg).show();
    }

    // 提交问卷
    $(document).on("click", "#submitQuestionnaire", function (e) {
        $("#submitQuestionnaire").attr("disabled", true);

        var questionnaireId = $("#questionnaire").attr("questionnaireId");

        // 是否有没有回答的问题
        var hasNotAnswerSubject = false;
        var subjectsAnswer = [];
        $("div[name=\"subject\"]").each(function () {
            var $t = $(this);

            var subjectId = $t.attr("subjectId");
            var subjectParam = {
                subjectId: subjectId
            };

            var type = $(this).attr("type");
            if (type == 0) {
                var selectedOptionId = $t.find("input[type=\"radio\"][name=\"" + subjectId + "\"]:checked").val();
                if (!selectedOptionId) {
                    hasNotAnswerSubject = true;
                    return;
                }
                subjectParam.selectedOptionId = selectedOptionId;
            } else if (type == 1) {
                var selectedOptionIds = [];
                $t.find("input[name=\"" + subjectId + "\"]:checked").each(function () {
                    selectedOptionIds.push($(this).val());
                });

                // 多选，必须选择两个以上
                if (selectedOptionIds.length < 1) {
                    hasNotAnswerSubject = true;
                    return;
                }

                subjectParam.selectedOptionIds = selectedOptionIds.toString();
            } else if (type == 2) {
                var c = $.trim($t.find("textarea[name=\"qASubject\"]").val());
                if (!c) {
                    hasNotAnswerSubject = true;
                    return;
                }
                subjectParam.answerContent = c;
            }

            subjectsAnswer.push(subjectParam);
        });

        if (hasNotAnswerSubject) {
            errorTip(Lr.questionnaireErrorWholeTip);
            $("#submitQuestionnaire").attr("disabled", false);
            return;
        }

        var params = {
            questionnaireid: questionnaireId,
            subjectsAnswer: subjectsAnswer
        };
        function getDatainfo(data) {
            if (data.success) {
                // 答卷成功
                successTip(Lr.successTip);

                var submitedAction = $("#questionnaire").attr("submitedAction");
                if (submitedAction == 1) {
                    showQuestionnaireAnswer();
                } else {
                    setTimeout(function () {
                        $("#questionnaire").hide("slow", function () {
                            if (window.DOCMAIN) {
                                $(".video-box").css({"width": "100%", "height": $("#topHalf").height()});
                                if ($(".vote").is(":visible") || $(".mask").is(":visible")) {
                                    $(".video-box").css({"width": 1, "height": 1});
                                }
                            }
                            $(this).remove();
                        });
                    }, 1500);
                }
                return;
            }

            if (data.errorCode == 400) {
                confirmAndCloseQuestionnaire(questionnaireId);
            } else {
                errorTip(data.msg);
            }
            $("#submitQuestionnaire").attr("disabled", false);
        }
        DWLive.submitQuestionnaire(params)
        // $.ajax({
        //     url: '//eva.csslcloud.net/api/questionnaire/submit',
        //     type: 'GET',
        //     dataType: 'jsonp',
        //     timeout: 5000,
        //     data: params,
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     success: function (data) {
        if (data.success) {
            // 答卷成功
            successTip(Lr.successTip);

            var submitedAction = $("#questionnaire").attr("submitedAction");
            if (submitedAction == 1) {
                showQuestionnaireAnswer();
            } else {
                setTimeout(function () {
                    $("#questionnaire").hide("slow", function () {
                        if (window.DOCMAIN) {
                            $(".video-box").css({"width": "100%", "height": $("#topHalf").height()});
                            if ($(".vote").is(":visible") || $(".mask").is(":visible")) {
                                $(".video-box").css({"width": 1, "height": 1});
                            }
                        }
                        $(this).remove();
                    });
                }, 1500);
            }
            return;
        }

        if (data.errorCode == 400) {
            confirmAndCloseQuestionnaire(questionnaireId);
        } else {
            errorTip(data.msg);
        }
        $("#submitQuestionnaire").attr("disabled", false);
        //     },
        //     error: function (xhr, status, error) {
        //         if (questionnaireId === $('#questionnaire').attr('questionnaireId')) {
        //             errorTip(Lr.networkErrorTip);
        //             $('#submitQuestionnaire').attr('disabled', false);
        //         }
        //     }
        // });
    });

    // 关闭问卷
    $(document).on("click", "#closeQuestionnaire", function (e) {
        $("#questionnaire").remove();
        if (window.DOCMAIN) {
            $(".video-box").css({"width": "100%", "height": $("#topHalf").height()});
            if ($(".vote").is(":visible") || $(".mask").is(":visible")) {
                $(".video-box").css({"width": 1, "height": 1});
            }
        }
    });

    // 关闭问卷
    $(document).on("click", "#close2Questionnaire", function (e) {
        $("#questionnaire").remove();
        $(".video-box").css({"width": "100%", "height": "100%"});
    });
});

/**
 * 显示正确答案
 *
 * */
function showQuestionnaireAnswer() {
    // 可以关闭
    $("#closeQuestionnaire").show();

    // 显示正确选项
    $("span[name=\"correctOption\"]").show();

    // 按钮进行缩进
    $("span[name=\"correctSubjectOption\"]").show();

    // 绿色背景
    $("label[correct=1]").css("color", "#4DB131");

    $("#submitQuestionnaire").hide();
    $("#close2Questionnaire").show();

    $("div[name=\"subject\"]").find("input").attr("disabled", true);

    // 拥有正确答案的题目个数
    var hasCorrectSubjectCount = $("div[name=\"subject\"]:has(span[name=\"correctSubjectOption\"])").length;
    if (hasCorrectSubjectCount == 0) {
        return;
    }

    // 用户答对题目个数
    var answerCorrectSubjectCount = 0;
    $("div[name=\"subject\"]:has(span[name=\"correctSubjectOption\"])").each(function () {
        var type = $(this).attr("type");
        if (type == 0) {
            if ($(this).find("input[type=\"radio\"][correct=\"1\"]:checked").length) {
                answerCorrectSubjectCount += 1;
            }
        } else if (type == 1) {
            // 多选题
            var selectedOptionIds = [];
            $(this).find("input[type=\"checkbox\"]:checked").each(function () {
                selectedOptionIds.push($(this).val());
            });

            var correctOptionIds = [];
            $(this).find("input[type=\"checkbox\"][correct=\"1\"]").each(function () {
                correctOptionIds.push($(this).val());
            });

            if (selectedOptionIds.sort().toString() == correctOptionIds.sort().toString()) {
                answerCorrectSubjectCount += 1;
            }
        }
    });

    var questionnaireMsg = "";
    if (answerCorrectSubjectCount == hasCorrectSubjectCount) {
        questionnaireMsg = "你的表现太棒了！";
    } else if ((answerCorrectSubjectCount / hasCorrectSubjectCount) >= 0.6) {
        questionnaireMsg = "恭喜您，通过了";
    } else {
        questionnaireMsg = "不要灰心，请继续努力！";
    }

    $("#questionnaireMsg").text(questionnaireMsg).show();
    $("#questionnaireSuccess").hide();
}

function on_cc_live_questionnaire_publish(data) {
    // 关闭弹出框
    $("#questionnaire, #questionnaireTip").remove();
    if (window.DOCMAIN) {
        $(".video-box").css({"width": "100%", "height": $("#topHalf").height()});
        if ($(".vote").is(":visible") || $(".mask").is(":visible")) {
            $(".video-box").css({"width": 1, "height": 1});
        }
    }

    $.ajax({
        url: "//eva.csslcloud.net/api/questionnaire/info",
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
                    subject.typeDesc = Lr.questionnaireTypeSingle;
                }

                if (subject.type == 1) {
                    subject.isMultipleSubject = true;
                    subject.typeDesc = Lr.questionnaireTypeMultiple;
                }

                if (subject.type == 2) {
                    subject.isQASubject = true;
                    subject.typeDesc = Lr.questionnaireTypeQA;
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

            questionnaire.questionnaireTip = Lr.questionnaireTip;
            questionnaire.successTip = Lr.successTip;
            questionnaire.failTip = Lr.failTip;
            questionnaire.tipSubmit = Lr.tipSubmit;

            $("body").append(Handlebars.getTemplate("questionnaire")(questionnaire));
            $("#questionnaire").height($("#bottomHalf").height());
            $("#questionnaire .box").height($("#bottomHalf").height() - 40);
            // 缩小播放器
            if (window.DOCMAIN) {
                $(".video-box").css({"width": 1, "height": 1});
            }
        }
    });
}

Handlebars.getTemplate = function (name) {


    if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
        $.ajax({
            url: "/js/templates/" + name + ".hbs",
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
function on_cc_live_questionnaire_publish_stop(data) {
    confirmAndCloseQuestionnaire(data.questionnaireId);
}

// 显示统计信息
function onQuestionnairePublishStatis(data) {
    // 关闭弹出框
    $("#questionnaire, #questionnaireTip").remove();
    if (window.DOCMAIN) {
        $(".video-box").css({"width": "100%", "height": $("#topHalf").height()});
        if ($(".vote").is(":visible") || $(".mask").is(":visible")) {
            $(".video-box").css({"width": 1, "height": 1});
        }
    }

    $.ajax({
        url: "//eva.csslcloud.net/api/questionnaire/statis/info",
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

            var questionnaire = data.datas;
            // 显示统计信息
            questionnaire.isShowStatisResult = true;
            var submitAnswerViewerCount = questionnaire.submitAnswerViewerCount;
            var subjects = questionnaire.subjects;
            $.each(subjects, function (subjectsIndex, subject) {

                subject.subjectIndex = subject.index + 1;

                if (subject.type == 0) {
                    subject.isSingleSubject = true;
                    subject.typeDesc = Lr.questionnaireTypeSingle;
                }

                if (subject.type == 1) {
                    subject.isMultipleSubject = true;
                    subject.typeDesc = Lr.questionnaireTypeMultiple;
                }

                if (subject.type == 2) {
                    subject.isQASubject = true;
                    subject.typeDesc = Lr.questionnaireTypeQA;
                    return true;
                }

                $.each(subject.options, function (optionIndex, option) {
                    option.indexDesc = String.fromCharCode(65 + option.index);

                    var selectedCount = option.selectedCount;
                    var selectedCountScale = 0;
                    var selectedCountProgress = "0%";

                    if (submitAnswerViewerCount > 0) {
                        selectedCountScale = (selectedCount * 100 / submitAnswerViewerCount).toFixed(0);
                        selectedCountProgress = selectedCountScale + "%";
                    }

                    option.selectedCountScale = selectedCountScale;
                    option.selectedCountProgress = selectedCountProgress;
                });

                // 选项排序
                subject.options.sort(function (o1, o2) {
                    return o1.index - o2.index;
                });
            });

            // 问题排序
            questionnaire.subjects.sort(function (s1, s2) {
                return s1.index - s2.index;
            });

            questionnaire.questionnaireTip = Lr.questionnaireTip;
            questionnaire.successTip = Lr.successTip;
            questionnaire.failTip = Lr.failTip;
            questionnaire.tipSubmit = Lr.tipSubmit;

            $("body").append(Handlebars.getTemplate("questionnaire")(questionnaire));
            $("#questionnaire").height($("#bottomHalf").height());
            $("#questionnaire .box").height($("#bottomHalf").height() - 40);
            // 缩小播放器
            if (window.DOCMAIN) {
                $(".video-box").css({"width": 1, "height": 1});
            }
        }
    });
}


function confirmAndCloseQuestionnaire(questionnaireId) {
    var $q = $("div[questionnaireid=\"" + questionnaireId + "\"]");
    if (!$q.length) {
        return;
    }

    $("body").append(Handlebars.getTemplate("confirm")({
        id: "questionnaireTip",
        msg: Lr.questionnaireErrorCloseTip,
        defineTip: Lr.defineTip,
        tipSubmit: Lr.tipSubmit,
        fix: "fixQuestionnaire(\"" + questionnaireId + "\");"
    }));
}

function fixQuestionnaire(questionnaireId) {
    $("#questionnaireTip").remove();
    if (window.DOCMAIN) {
        $(".video-box").css({"width": "100%", "height": $("#topHalf").height()});
        if ($(".vote").is(":visible") || $(".mask").is(":visible")) {
            $(".video-box").css({"width": 1, "height": 1});
        }
    }
    $("div[questionnaireid=\"" + questionnaireId + "\"]").remove();
}