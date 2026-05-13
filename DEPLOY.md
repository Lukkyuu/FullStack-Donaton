# Despliegue a AWS (resumen y scripts)

Este repositorio incluye scripts para facilitar la fusión de ramas, construcción de imágenes Docker y despliegue a AWS ECR/ECS.

## Requisitos

- `git` instalado y acceso al repositorio.
- `docker` (Desktop o engine) configurado.
- `aws-cli` configurado con credenciales que tengan permisos para ECR, ECS, EC2 y IAM.

## Flujo recomendado

1. Fusionar ramas en `main`.
2. Probar el stack local con Docker.
3. Crear repositorios ECR.
4. Subir imágenes Docker.
5. Registrar task definitions.
6. Crear cluster y servicios ECS.

## 1) Fusionar ramas en `main` (local)

```powershell
# Ejecutar desde la raíz del repo
.\scripts\merge_branches.ps1
```

El script hace `git fetch`, `checkout main`, `pull`, y luego intenta merge de `origin/Backend` y `origin/Frontend`. Si hay conflictos se detiene para que los resuelvas manualmente.

## 2) Probar el stack local

```powershell
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml ps
docker-compose -f docker-compose.dev.yml logs -f
```

## 3) Construir y subir imágenes a ECR

```powershell
.\scripts\docker_push_ecr.ps1 -AWSAccountId <AWS_ACCOUNT_ID> -AWSRegion <AWS_REGION>
```

El script intenta crear repositorios ECR por servicio, construir la imagen desde `backend/donaton-backend/<service>` y pushearla a ECR.

## 4) Generar task definitions ECS (plantillas)

```powershell
.\scripts\generate_task_definitions.ps1 -AWSAccountId <AWS_ACCOUNT_ID> -AWSRegion <AWS_REGION>
```

Esto crea JSON en `infra/task-definitions/` que puedes registrar con `aws ecs register-task-definition --cli-input-json file://infra/task-definitions/<service>-task.json`.

## 5) AWS Academy: crear ECR y ECS

```powershell
# Configura credenciales de AWS Academy
aws configure
aws sts get-caller-identity

# Crear cluster ECS
aws ecs create-cluster --cluster-name donaton-cluster --region <AWS_REGION>

# Crear repositorios ECR (si no existen)
aws ecr create-repository --repository-name ms-auth --region <AWS_REGION>
aws ecr create-repository --repository-name ms-donacion --region <AWS_REGION>
aws ecr create-repository --repository-name ms-gateway --region <AWS_REGION>
aws ecr create-repository --repository-name ms-logistica --region <AWS_REGION>
aws ecr create-repository --repository-name ms-matching --region <AWS_REGION>
aws ecr create-repository --repository-name ms-necesidad --region <AWS_REGION>
aws ecr create-repository --repository-name ms-notificaciones --region <AWS_REGION>
aws ecr create-repository --repository-name ms-usuarios --region <AWS_REGION>

# Subir imágenes a ECR
.\scripts\docker_push_ecr.ps1 -AWSAccountId <AWS_ACCOUNT_ID> -AWSRegion <AWS_REGION>

# Generar task definitions
.\scripts\generate_task_definitions.ps1 -AWSAccountId <AWS_ACCOUNT_ID> -AWSRegion <AWS_REGION>
```

Luego registra las task definitions y crea servicios ECS con tus subnets y security groups:

```powershell
aws ecs register-task-definition --cli-input-json file://infra/task-definitions/ms-gateway-task.json --region <AWS_REGION>

aws ecs create-service --cluster donaton-cluster --service-name ms-gateway-service --task-definition ms-gateway-task --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[<subnet-ids>],securityGroups=[<sg-ids>],assignPublicIp=ENABLED}" --region <AWS_REGION>
```

## Notas

- Reemplaza `<AWS_ACCOUNT_ID>`, `<AWS_REGION>`, `<subnet-ids>` y `<sg-ids>` por valores reales.
- Revisa los puertos en las task definitions y ajústalos si tus servicios usan puertos diferentes.
- En Docker, el frontend debe hablar con `http://ms-gateway:8080` dentro de la red interna.
- Si prefieres crear PRs en lugar de merges directos, usa la interfaz de GitHub para cada rama.

## Si quieres seguir

- Puedo generar `task-*.json` con puertos específicos si me indicas el puerto de cada microservicio.
- Puedo adaptar el `docker-compose.yml` para desarrollo local con un perfil que levante solo frontend, postgres y rabbitmq, o dejar una versión full-stack para AWS.
