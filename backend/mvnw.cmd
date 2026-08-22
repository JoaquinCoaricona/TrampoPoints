@echo off
setlocal
set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.

set MAVEN_CMD="%DIRNAME%\.mvn\maven\bin\mvn.cmd"

if exist %MAVEN_CMD% (
    %MAVEN_CMD% %*
) else (
    echo Error: Maven executable not found at %MAVEN_CMD%
    exit /b 1
)
