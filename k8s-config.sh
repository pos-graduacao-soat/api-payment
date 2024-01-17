# secrets
kubectl apply -f deploy/kubernetes/secrets/db-secrets.yaml
kubectl apply -f deploy/kubernetes/secrets/api-secrets.yaml

# volumes
kubectl apply -f deploy/kubernetes/db/db-persistent-volume.yaml
kubectl apply -f deploy/kubernetes/db/db-pvc.yaml

# db
kubectl apply -f deploy/kubernetes/db/db-deployment.yaml
kubectl apply -f deploy/kubernetes/db/db-service.yaml

# api
kubectl apply -f deploy/kubernetes/api/api-deployment.yaml
kubectl apply -f deploy/kubernetes/api/api-service.yaml