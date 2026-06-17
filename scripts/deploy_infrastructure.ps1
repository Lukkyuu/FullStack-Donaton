# deploy_infrastructure.ps1
# Script para crear la infraestructura base en la nueva cuenta de AWS

$Region = "us-west-2"
$VpcId = "vpc-0f7e3b94cf81458e1"
$Subnets = @("subnet-0b25c9c582f09cec5", "subnet-0ea474dbd91a5b042", "subnet-0fe033f67d596ae22", "subnet-08ddffc1d71606f51")
$SecurityGroupId = "sg-0de0645feff865664"
$BucketName = "donaton-frontend-bucket-729867975043"
$RDSIdentifier = "donaton-db"
$ClusterName = "donaton-cluster"

$ECRRepositories = @(
    "donaton-backend",
    "donaton-auth",
    "donaton-donacion",
    "donaton-logistica",
    "donaton-necesidad",
    "donaton-usuarios",
    "donaton-matching",
    "donaton-notificaciones"
)

Write-Host "=== 1. Creando Instancia RDS PostgreSQL ===" -ForegroundColor Green
# Intenta crear la base de datos (ignora si ya existe)
try {
    $rds = aws rds describe-db-instances --db-instance-identifier $RDSIdentifier --region $Region 2>$null
    if ($rds) {
        Write-Host "La instancia RDS '$RDSIdentifier' ya existe." -ForegroundColor Yellow
    } else {
        aws rds create-db-instance `
            --db-instance-identifier $RDSIdentifier `
            --db-instance-class db.t3.micro `
            --engine postgres `
            --master-username root `
            --master-user-password password123 `
            --allocated-storage 20 `
            --db-name postgres `
            --no-publicly-accessible `
            --region $Region
        Write-Host "Creación de la instancia RDS iniciada." -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error al crear RDS: $_" -ForegroundColor Red
}

Write-Host "=== 2. Creando Clúster ECS ===" -ForegroundColor Green
aws ecs create-cluster --cluster-name $ClusterName --region $Region

Write-Host "=== 3. Creando Repositorios ECR ===" -ForegroundColor Green
foreach ($repo in $ECRRepositories) {
    try {
        $check = aws ecr describe-repositories --repository-names $repo --region $Region 2>$null
        if ($check) {
            Write-Host "El repositorio ECR '$repo' ya existe." -ForegroundColor Yellow
        } else {
            aws ecr create-repository --repository-name $repo --region $Region
            Write-Host "Creado repositorio ECR: $repo" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "Error con el repositorio ${repo}: $_" -ForegroundColor Red
    }
}

Write-Host "=== 4. Creando Bucket S3 para Frontend ===" -ForegroundColor Green
    # Comprobar si el bucket ya existe
    $null = aws s3api head-bucket --bucket $BucketName 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Bucket S3 '$BucketName' no existe. Creándolo..." -ForegroundColor Cyan
        aws s3api create-bucket `
            --bucket $BucketName `
            --region $Region `
            --create-bucket-configuration LocationConstraint=$Region
        Write-Host "Bucket S3 '$BucketName' creado." -ForegroundColor Cyan
    } else {
        Write-Host "Bucket S3 ya existe o es accesible." -ForegroundColor Yellow
    }

# Configurar acceso público y hosting web
Write-Host "Configurando políticas públicas y hosting web en S3..." -ForegroundColor Green
aws s3api put-public-access-block `
    --bucket $BucketName `
    --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false

$Policy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BucketName/*"
        }
    ]
}
"@
$PolicyFile = "s3_policy.json"
$Policy | Set-Content $PolicyFile
aws s3api put-bucket-policy --bucket $BucketName --policy file://$PolicyFile
Remove-Item $PolicyFile -Force

aws s3api put-bucket-website `
    --bucket $BucketName `
    --website-configuration "IndexDocument={Suffix=index.html},ErrorDocument={Key=index.html}"

Write-Host "Bucket S3 configurado como sitio web." -ForegroundColor Cyan

Write-Host "=== 5. Creando Application Load Balancer (ALB) ===" -ForegroundColor Green
$AlbArn = ""
try {
    $albInfo = aws elbv2 describe-load-balancers --names donaton-alb --region $Region 2>$null
    if ($albInfo) {
        Write-Host "El ALB 'donaton-alb' ya existe." -ForegroundColor Yellow
        $AlbArn = ($albInfo | ConvertFrom-Json).LoadBalancers[0].LoadBalancerArn
    } else {
        $subnetsStr = $Subnets -join " "
        $albResult = aws elbv2 create-load-balancer `
            --name donaton-alb `
            --subnets $Subnets[0] $Subnets[1] $Subnets[2] $Subnets[3] `
            --security-groups $SecurityGroupId `
            --region $Region
        $AlbArn = ($albResult | ConvertFrom-Json).LoadBalancers[0].LoadBalancerArn
        Write-Host "ALB 'donaton-alb' creado exitosamente." -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error al crear ALB: $_" -ForegroundColor Red
}

Write-Host "=== 6. Creando Target Group para Puerto 8080 ===" -ForegroundColor Green
$TgArn = ""
try {
    $tgInfo = aws elbv2 describe-target-groups --names donaton-tg --region $Region 2>$null
    if ($tgInfo) {
        Write-Host "El Target Group 'donaton-tg' ya existe." -ForegroundColor Yellow
        $TgArn = ($tgInfo | ConvertFrom-Json).TargetGroups[0].TargetGroupArn
    } else {
        $tgResult = aws elbv2 create-target-group `
            --name donaton-tg `
            --protocol HTTP `
            --port 8080 `
            --vpc-id $VpcId `
            --target-type ip `
            --region $Region
        $TgArn = ($tgResult | ConvertFrom-Json).TargetGroups[0].TargetGroupArn
        Write-Host "Target Group 'donaton-tg' creado." -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error al crear Target Group: $_" -ForegroundColor Red
}

Write-Host "=== 7. Creando Listener para ALB ===" -ForegroundColor Green
if ($AlbArn -and $TgArn) {
    try {
        $listeners = aws elbv2 describe-listeners --load-balancer-arn $AlbArn --region $Region 2>$null
        $listenersObj = $listeners | ConvertFrom-Json
        if ($listenersObj.Listeners.Length -gt 0) {
            Write-Host "El Listener para el ALB ya existe." -ForegroundColor Yellow
        } else {
            aws elbv2 create-listener `
                --load-balancer-arn $AlbArn `
                --protocol HTTP `
                --port 80 `
                --default-actions Type=forward,TargetGroupArn=$TgArn `
                --region $Region
            Write-Host "Listener creado en puerto 80 redireccionando a Target Group." -ForegroundColor Cyan
        }
    } catch {
        Write-Host "Error al crear Listener: $_" -ForegroundColor Red
    }
}

Write-Host "=== INFRAESTRUCTURA INICIAL CREADA EXCELENTEMENTE ===" -ForegroundColor Green
