param (
    [Parameter(Mandatory=$true)]
    [string]$AWSAccountId,
    
    [Parameter(Mandatory=$true)]
    [string]$AWSRegion
)

$Registry = "$AWSAccountId.dkr.ecr.$AWSRegion.amazonaws.com"

Write-Host "Authenticating Docker with Amazon ECR..." -ForegroundColor Green
$ECRPassword = aws ecr get-login-password --region $AWSRegion
docker login --username AWS --password $ECRPassword $Registry

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to authenticate Docker with ECR."
    exit 1
}

$Images = @(
    @{ File = "Dockerfile"; Repo = "donaton-backend" },
    @{ File = "Dockerfile.auth"; Repo = "donaton-auth" },
    @{ File = "Dockerfile.donacion"; Repo = "donaton-donacion" },
    @{ File = "Dockerfile.logistica"; Repo = "donaton-logistica" },
    @{ File = "Dockerfile.matching"; Repo = "donaton-matching" },
    @{ File = "Dockerfile.necesidad"; Repo = "donaton-necesidad" },
    @{ File = "Dockerfile.notificaciones"; Repo = "donaton-notificaciones" },
    @{ File = "Dockerfile.usuarios"; Repo = "donaton-usuarios" }
)

foreach ($img in $Images) {
    $Tag = "$Registry/$($img.Repo):latest"
    Write-Host "=== Building and pushing $($img.Repo) ===" -ForegroundColor Green
    
    if ($img.File -eq "Dockerfile") {
        docker build -t $Tag .
    } else {
        docker build -f $($img.File) -t $Tag .
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to build image $($img.Repo)"
        exit 1
    }
    
    docker push $Tag
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to push image $($img.Repo) to ECR"
        exit 1
    }
    
    Write-Host "Pushed $Tag successfully!" -ForegroundColor Cyan
}

Write-Host "=== All ECR images pushed successfully ===" -ForegroundColor Green
