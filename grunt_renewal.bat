SET gruntLogFilePath=D:\lotte\logs\grunt\grunt_dc_log.log

call grunt comm2017 > %gruntLogFilePath%
call grunt ProductView > %gruntLogFilePath%
call grunt ProductBenefitCompare >> %gruntLogFilePath%
call grunt ProductCollectBenefits >> %gruntLogFilePath%
call grunt ProductComment >> %gruntLogFilePath%
call grunt ProductCommentDetail >> %gruntLogFilePath%
call grunt ProductExtInfo >> %gruntLogFilePath%
call grunt ProductImageView >> %gruntLogFilePath%
call grunt ProductQna >> %gruntLogFilePath%
call grunt ProductReqInfo >> %gruntLogFilePath%
call grunt productMdNotice >> %gruntLogFilePath%
call grunt productDetailInfo >> %gruntLogFilePath%
call grunt productPlanDetailInfoTop >> %gruntLogFilePath%
call grunt productPlanDetailInfoBottom >> %gruntLogFilePath%
call grunt SmpBooking >> %gruntLogFilePath%
call grunt Product >> %gruntLogFilePath%
call grunt loginForm >> %gruntLogFilePath%