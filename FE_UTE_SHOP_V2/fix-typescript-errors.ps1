# Script to fix common TypeScript errors
# Remove unused React imports
Get-ChildItem -Path src -Recurse -Filter *.tsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match '^import React from "react"[\r\n]') {
        $content = $content -replace '^import React from "react"[\r\n]+', ''
        Set-Content -Path $_.FullName -Value $content -NoNewline
    }
    if ($content -match '^import React,') {
        # Keep React if it's used with other imports
        if ($content -notmatch '\bReact\.') {
            $content = $content -replace '^import React,', 'import'
            Set-Content -Path $_.FullName -Value $content -NoNewline
        }
    }
}

Write-Host "Fixed React imports"

