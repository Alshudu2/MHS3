$data = Get-Content 'complete_monster_database.json' | ConvertFrom-Json
$names = $data.monsters | Select-Object -ExpandProperty name
$duplicates = $names | Group-Object | Where-Object {$_.Count -gt 1}
if ($duplicates) {
    Write-Host "Found duplicates:"
    $duplicates | ForEach-Object { Write-Host "$($_.Name): $($_.Count) times" }
} else {
    Write-Host "No duplicates found in monster names"
}
Write-Host "Total monsters: $($names.Count)"
Write-Host "Unique monsters: $(($names | Sort-Object -Unique).Count)"