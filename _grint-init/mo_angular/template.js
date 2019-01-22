'use strict';

exports.description = '롯데닷컴 모바일 Angular 소스 파일 생성';
// 시작 전 안내 내용
exports.notes = '';
// 완료 후 안내 내용
exports.after = '';

exports.warnOn = '*.html';

exports.template = function(grunt, init, done) {
    function getPrompt(options) {
        var prompt = init.prompt(options.name),
            sName;
        for (sName in options) {
            if (! (sName in prompt)) {
                prompt[sName] = options[sName];
            }
        }
        return prompt;
    }

    init.process({}, [
        getPrompt({
            name:'job_name',
            message:'작업명을 입력하세요'
        }),
        getPrompt({
            name:'folder_name',
            message:'폴더명을 입력하세요'
        }),
        getPrompt({
            name:'file_name',
            message:'파일명을 입력하세요'
        }),
        getPrompt({
            name:'controller_name',
            message:'controller명을 입력하세요(+Ctrl 제외)'
        })
    ], function(err, props) {
        var files = init.filesToCopy(props);
        init.copyAndProcess(files, props, {});
    });
};