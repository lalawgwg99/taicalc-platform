@echo off
echo [TaiCalc Automation] Scheduling Shutdown for 17:00...

:: Get current time to calculate seconds remaining (approximate) or just use 'at' command logic simulator
:: Since 'at' is deprecated, we use powershell to calculate strict seconds until 17:00

powershell -Command "$target = Get-Date -Hour 17 -Minute 0 -Second 0; $now = Get-Date; if ($target -lt $now) { $target = $target.AddDays(1) }; $seconds = [math]::Ceiling(($target - $now).TotalSeconds); Write-Host 'Seconds until 17:00: ' $seconds; shutdown /s /t $seconds /c 'TaiCalc Automation: Shutdown scheduled for 17:00'"

echo.
echo Shutdown scheduled! 
echo To cancel, run: shutdown /a
echo.
pause
