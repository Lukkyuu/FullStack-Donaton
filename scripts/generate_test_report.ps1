# scripts/generate_test_report.ps1

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "INICIANDO EJECUCION DE PRUEBAS DE DONATON" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$backendDir = "$PSScriptRoot\..\backend\donaton-backend"

# 1. Ejecutar pruebas unitarias de Maven
Write-Host "Ejecutando pruebas unitarias de Maven en $backendDir..." -ForegroundColor Yellow
Push-Location $backendDir
try {
    # Ejecutamos las pruebas. Ignoramos si falla para poder reportar los fallos en el HTML
    & .\mvnw.cmd test
} catch {
    Write-Host "Hubo algunos fallos en la compilacion o ejecucion de pruebas, procesando reporte de todos modos..." -ForegroundColor DarkYellow
}
Pop-Location

# 2. Buscar archivos XML de reportes Surefire
Write-Host "Buscando reportes XML generados por Surefire..." -ForegroundColor Yellow
$reportFiles = Get-ChildItem -Path "$backendDir" -Filter "TEST-*.xml" -Recurse

if ($null -eq $reportFiles -or $reportFiles.Count -eq 0) {
    Write-Host "[ERROR] No se encontraron archivos de reporte Surefire. Asegurate de compilar correctamente." -ForegroundColor Red
    exit 1
}

Write-Host "Se encontraron $($reportFiles.Count) archivos de reportes. Procesando..." -ForegroundColor Green

$results = @()

foreach ($file in $reportFiles) {
    try {
        [xml]$xml = Get-Content -Path $file.FullName -Raw -Encoding utf8
        $testsuite = $xml.testsuite
        if ($null -eq $testsuite) { continue }

        # Extraer el nombre del módulo de forma segura (buscando ms-*)
        $moduleName = "unknown"
        if ($file.FullName -match "backend[/\\]donaton-backend[/\\](ms-[^/\\]+)") {
            $moduleName = $Matches[1]
        }

        $suiteName = $testsuite.name
        $tests = if ($testsuite.tests) { [int]$testsuite.tests } else { 0 }
        $failures = if ($testsuite.failures) { [int]$testsuite.failures } else { 0 }
        $errors = if ($testsuite.errors) { [int]$testsuite.errors } else { 0 }
        $skipped = if ($testsuite.skipped) { [int]$testsuite.skipped } else { 0 }
        $time = if ($testsuite.time) { [double]$testsuite.time } else { 0.0 }

        $cases = @()
        $testcases = if ($testsuite.testcase) { @($testsuite.testcase) } else { @() }

        foreach ($case in $testcases) {
            $caseName = $case.name
            $classname = $case.classname
            $caseTime = if ($case.time) { [double]$case.time } else { 0.0 }
            $status = "PASSED"
            $message = ""

            if ($case.failure) {
                $status = "FAILED"
                $message = $case.failure.InnerText
                if (-not $message) { $message = $case.failure.message }
            } elseif ($case.error) {
                $status = "ERROR"
                $message = $case.error.InnerText
                if (-not $message) { $message = $case.error.message }
            } elseif ($case.skipped) {
                $status = "SKIPPED"
            }

            $cases += [PSCustomObject]@{
                name = $caseName
                classname = $classname
                time = $caseTime
                status = $status
                message = $message
            }
        }

        $results += [PSCustomObject]@{
            module = $moduleName
            className = $suiteName
            testsCount = $tests
            failuresCount = $failures
            errorsCount = $errors
            skippedCount = $skipped
            duration = $time
            cases = $cases
        }
    } catch {
        Write-Host "[ADVERTENCIA] Error procesando archivo: $($file.FullName) - $_" -ForegroundColor Yellow
    }
}

# 3. Serializar resultados a JSON
$jsonData = $results | ConvertTo-Json -Depth 5 -Compress

# 4. Generar Dashboard HTML usando la plantilla
$templatePath = "$PSScriptRoot\report_template.html"
$outputPath = "$PSScriptRoot\..\test-results-dashboard.html"

if (-not (Test-Path -Path $templatePath)) {
    Write-Host "[ERROR] No se encontro la plantilla HTML en $templatePath" -ForegroundColor Red
    exit 1
}

$htmlTemplate = Get-Content -Path $templatePath -Raw -Encoding utf8
$htmlContent = $htmlTemplate.Replace("@JSON_DATA@", $jsonData)

Set-Content -Path $outputPath -Value $htmlContent -Encoding utf8

Write-Host "==================================================" -ForegroundColor Green
Write-Host "[OK] DASHBOARD GENERADO CORRECTAMENTE" -ForegroundColor Green
Write-Host "Ruta: $outputPath" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
