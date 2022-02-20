---
date: "2018-10-03T10:14:46-07:00"
draft: false
title: Cleanup
weight: 70
---

Once you have completed this chapter, you can cleanup the files and resources you created by issuing the following commands:

```bash
unset AWS_SECRET_ACCESS_KEY
unset AWS_ACCESS_KEY_ID
rm rbacuser_creds.sh
rm rbacuser-role.yaml
rm rbacuser-role-binding.yaml
aws iam delete-access-key --user-name=rbac-user --access-key-id=$(jq -r .AccessKey.AccessKeyId /tmp/create_output.json)
aws iam delete-user --user-name rbac-user
rm /tmp/create_output.json
```

Next remove the `rbac-user` mapping from the existing configMap by editing the existing aws-auth.yaml file:

```
data:
  mapUsers: |
    []
```

And apply the ConfigMap and delete the aws-auth.yaml file
```bash
kubectl apply -f aws-auth.yaml
rm aws-auth.yaml
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