---
date: "2018-10-03T10:14:46-07:00"
draft: false
title: Create Role and Role Binding
weight: 20
---

As mentioned earlier, we have our new user rbac-user, but its not yet bound to any roles.  In order to do that, we'll need to switch back to our default admin user.

Run the following to unset the environmental variables that define us as rbac-user:

```bash
unset AWS_SECRET_ACCESS_KEY
unset AWS_ACCESS_KEY_ID
```

To verify we're the admin user again, and no longer rbac-user, issue the following command:

```bash
aws sts get-caller-identity
```

The output should show the user is no longer rbac-user:

```
{
    "Account": <AWS Account ID>,
    "UserId": <AWS User ID>,
    "Arn": "arn:aws:iam::<your AWS account ID>:assumed-role/eksworkshop-admin/i-123456789"
}
```

Now that we're the admin user again, we'll create a role called pod-reader that provides list, get, and watch access for pods and deployments, but only for the `workshop` namespace.  Run the following to create this role:

```bash
cat << EoF > rbacuser-role.yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: workshop
  name: pod-reader
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["list","get","watch"]
- apiGroups: ["extensions","apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch"]
EoF
```

We have the user, we have the role, and now we're bind them together with a RoleBinding resource.  Run the following to create this RoleBinding:

```bash
cat << EoF > rbacuser-role-binding.yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: read-pods
  namespace: workshop
subjects:
- kind: User
  name: rbac-user
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
EoF
```

Next, we apply the Role, and RoleBindings we created:

```bash
kubectl apply -f rbacuser-role.yaml
kubectl apply -f rbacuser-role-binding.yaml
```