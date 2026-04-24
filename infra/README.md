# Infrastructure Notes

## EC2 Security Group (minimum rules)

| Type        | Protocol | Port Range | Source            | Purpose              |
|-------------|----------|------------|-------------------|----------------------|
| SSH         | TCP      | 22         | Your IP / VPN     | Admin access         |
| Custom TCP  | TCP      | 3000       | ALB SG / 0.0.0.0  | App traffic          |
| Custom TCP  | TCP      | 8080       | Your Jenkins IP   | Jenkins UI           |
| HTTPS       | TCP      | 443        | 0.0.0.0/0         | If behind ALB        |

## IAM Role for EC2 (attach to instance)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:GetAuthorizationToken",
        "ssm:GetParameter",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

## CloudWatch Log Group

Create log group `/node-express-aws/production` before first deploy.

## Recommended EC2 Instance

| Environment | Type       | vCPU | RAM   |
|-------------|------------|------|-------|
| Dev/Staging | t3.small   | 2    | 2 GB  |
| Production  | t3.medium  | 2    | 4 GB  |

## Jenkins Credentials to Configure

| Credential ID    | Type                   | Value                         |
|------------------|------------------------|-------------------------------|
| `EC2_HOST`       | Secret text            | EC2 public DNS / IP           |
| `ec2-ssh-key`    | SSH Username+PK        | Your .pem private key         |
| `DOCKERHUB_CREDS`| Username+Password      | Docker Hub login              |

