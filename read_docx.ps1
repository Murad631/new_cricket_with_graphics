Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipPath = 'D:\cricket\cricket_projetc\antigravity instruction.docx'
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
$entry = $zip.GetEntry('word/document.xml')
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xmlStr = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()
$text = $xmlStr -replace '<w:p\b[^>]*>', "`n" -replace '<[^>]+>', ''
$text
