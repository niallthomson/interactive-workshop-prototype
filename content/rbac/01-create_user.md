---
date: "2018-10-03T10:14:46-07:00"
draft: false
title: Create User
weight: 20
---

::alert[For the sake of simplicity, in this chapter, we will save credentials to a file to make it easy to toggle back and forth between users.  Never do this in production or with credentials that have privileged access; It is not a security best practice to store credentials on the filesystem.]{type="info"}

From within the Cloud9 terminal, create a new user called rbac-user, and generate/save credentials for it:

```bash
aws iam create-user --user-name rbac-user
aws iam create-access-key --user-name rbac-user | \
  tee /tmp/create_output.json
```

By running the previous step, you should get a response similar to:

```
{
    "AccessKey": {
        "UserName": "rbac-user",
        "Status": "Active",
        "CreateDate": "2019-07-17T15:37:27Z",
        "SecretAccessKey": < AWS Secret Access Key > ,
        "AccessKeyId": < AWS Access Key >
    }
}
```

To make it easy to switch back and forth between the admin user you created the cluster with, and this new rbac-user, run the following command to create a script that when sourced, sets the active user to be rbac-user:

```bash
cat << EoF > rbacuser_creds.sh
export AWS_SECRET_ACCESS_KEY=$(jq -r .AccessKey.SecretAccessKey /tmp/create_output.json)
export AWS_ACCESS_KEY_ID=$(jq -r .AccessKey.AccessKeyId /tmp/create_output.json)
EoF
```