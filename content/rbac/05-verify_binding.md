---
date: "2018-10-03T10:14:46-07:00"
draft: false
title: Verify the Role and Role Binding
weight: 20
---

Now that the user, Role, and RoleBinding are defined, lets switch back to rbac-user, and test.

To switch back to rbac-user, issue the following command that sources the rbac-user env vars, and verifies they've taken:

```bash
. rbacuser_creds.sh; aws sts get-caller-identity
```

You should see output reflecting that you are logged in as rbac-user.

As rbac-user, issue the following to get pods in the rbac namespace:

```bash
kubectl get pods -n workshop
```

The output should be similar to:

```
NAME                          READY   STATUS    RESTARTS   AGE
frontend-657d785b6-bpp4x      1/1     Running   0          14h
prodcatalog-95df774d4-46cfv   1/1     Running   0          7d14h
proddetail-745889bdf7-fdrcg   1/1     Running   0          62m
```

Try running the same command again, but outside of the workshop namespace:

```bash
kubectl get pods -n kube-system
```

You should get an error similar to:
```
No resources found.
Error from server (Forbidden): pods is forbidden: User "rbac-user" cannot list resource "pods" in API group "" in the namespace "kube-system"
```

Because the role you are bound to does not give you access to any namespace other than workshop.