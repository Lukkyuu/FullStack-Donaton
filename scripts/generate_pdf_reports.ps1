# scripts/generate_pdf_reports.ps1

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "INICIANDO GENERACION DE REPORTES PDF EN DONATON" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Encontrar Microsoft Edge dinámicamente
$edgePaths = @(
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "$env:LocalAppData\Microsoft\Edge\Application\msedge.exe"
)

$edgePath = $null
foreach ($path in $edgePaths) {
    if (Test-Path -Path $path) {
        $edgePath = $path
        break
    }
}

if ($null -eq $edgePath) {
    # Intentamos encontrar en el PATH de Windows
    $cmdPath = Get-Command msedge -ErrorAction SilentlyContinue
    if ($null -ne $cmdPath) {
        $edgePath = $cmdPath.Source
    }
}

if ($null -eq $edgePath) {
    Write-Host "[ERROR] No se pudo encontrar la ruta de Microsoft Edge (msedge.exe)." -ForegroundColor Red
    Write-Host "Por favor, asegúrate de tener instalado Microsoft Edge." -ForegroundColor Red
    exit 1
}

Write-Host "Usando Microsoft Edge desde: $edgePath" -ForegroundColor Green

# 2. Configurar rutas de archivos
$docsDir = "$PSScriptRoot\..\docs"
$reports = @(
    @{
        Html = "$docsDir\persistencia-datos.html"
        Pdf  = "$docsDir\persistencia-datos.pdf"
        Name = "Persistencia de Datos"
    },
    @{
        Html = "$docsDir\reporte-pruebas.html"
        Pdf  = "$docsDir\reporte-pruebas.pdf"
        Name = "Reporte de Pruebas Unitarias y Cobertura"
    },
    @{
        Html = "$docsDir\presentacion.html"
        Pdf  = "$docsDir\presentacion.pdf"
        Name = "Presentacion Diapositivas (Slides)"
    }
)

# 3. Procesar y generar cada PDF
foreach ($report in $reports) {
    $htmlFile = $report.Html
    $pdfFile = $report.Pdf
    $name = $report.Name

    Write-Host "Generando PDF para: $name..." -ForegroundColor Yellow

    if (-not (Test-Path -Path $htmlFile)) {
        Write-Host "[ERROR] Archivo HTML no encontrado: $htmlFile" -ForegroundColor Red
        exit 1
    }

    # Comando Headless Edge para imprimir a PDF
    try {
        # Edge requiere rutas absolutas bien formadas.
        $absHtml = (Get-Item $htmlFile).FullName
        $absPdf = $pdfFile

        Write-Host "Leyendo HTML: $absHtml" -ForegroundColor Gray
        Write-Host "Escribiendo PDF: $absPdf" -ForegroundColor Gray

        # Ejecutamos Microsoft Edge en segundo plano
        $process = Start-Process -FilePath $edgePath -ArgumentList "--headless", "--disable-gpu", "--print-to-pdf=`"$absPdf`"", "`"$absHtml`"" -PassThru -Wait -NoNewWindow
        
        # Breve espera para asegurar que el sistema de archivos libere el descriptor
        Start-Sleep -Seconds 2

        if (Test-Path -Path $pdfFile) {
            $fileInfo = Get-Item $pdfFile
            if ($fileInfo.Length -gt 0) {
                Write-Host "[OK] PDF '$name' generado exitosamente." -ForegroundColor Green
                Write-Host "Ruta: $pdfFile ($($fileInfo.Length) bytes)" -ForegroundColor Green
            } else {
                Write-Host "[ERROR] PDF '$name' generado vacío (0 bytes)." -ForegroundColor Red
                exit 1
            }
        } else {
            Write-Host "[ERROR] No se encontró el archivo PDF generado en la ruta esperada." -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "[ERROR] Falló la conversión a PDF para '$name': $_" -ForegroundColor Red
        exit 1
    }
    Write-Host "--------------------------------------------------" -ForegroundColor Gray
}

Write-Host "==================================================" -ForegroundColor Green
Write-Host "[OK] TODOS LOS REPORTES PDF SE GENERARON CORRECTAMENTE" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
