---
date: "2018-10-03T10:14:46-07:00"
draft: false
title: Map User to Kubernetes
weight: 20
---

Next, we'll define a k8s user called rbac-user, and map to its IAM user counterpart.  Run the following to get the existing ConfigMap and save into a file called aws-auth.yaml:
```bash
kubectl get configmap -n kube-system aws-auth -o yaml | \ 
  grep -v "creationTimestamp\|resourceVersion\|selfLink\|uid" | \ 
  sed '/^  annotations:/,+2 d' > aws-auth.yaml
```
Next manually add the below under "data:" section in the aws-auth.yaml you just saved in above step.

```
mapUsers: |
  - userarn: arn:aws:iam::${ACCOUNT_ID}:user/rbac-user
    username: rbac-user
```

To verify everything populated and was created correctly, run the following:

```bash
cat aws-auth.yaml
```

And the output should reflect that rolearn and userarn populated, similar to:

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-auth
  namespace: kube-system
data:
  mapUsers: |
    - userarn: arn:aws:iam::123456789:user/rbac-user
      username: rbac-user
```

Next, apply the ConfigMap to apply this mapping to the system:

```bash
kubectl apply -f aws-auth.yaml
```