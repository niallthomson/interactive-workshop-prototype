---
date: "2018-10-03T10:14:46-07:00"
draft: false
title: Test the User
weight: 20
---

Up until now, as the cluster operator, you've been accessing the cluster as the admin user.  Let's now see what happens when we access the cluster as the newly created rbac-user.

Issue the following command to source the rbac-user's AWS IAM user environmental variables:

```bash
. rbacuser_creds.sh
```
By running the above command, you've now set AWS environmental variables which should override the default admin user or role.  To verify we've overrode the default user settings, run the following command:

```bash
aws sts get-caller-identity
```

You should see something similar to below, where we're now making API calls as rbac-user:

```

{
    "Account": <AWS Account ID>,
    "UserId": <AWS User ID>,
    "Arn": "arn\:aws\:iam::<AWS Account ID>\:user/rbac-user"
}

```

Now that we're making calls in the context of the rbac-user, lets quickly make a request to get all pods:

```bash
kubectl get pods -n workshop
```

You should get a response back similar to:

```
No resources found.  Error from server (Forbidden): pods is forbidden: User "rbac-user" cannot list resource "pods" in API group "" in the namespace "workshop"
```

We already created the rbac-user, so why did we get that error?

Just creating the user doesn't give that user access to any resources in the cluster.  In order to achieve that, we'll need to define a role, and then bind the user to that role.  We'll do that next.