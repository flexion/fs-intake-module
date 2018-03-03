## Deploying to ECS

### Setup
* Setup AWS profile for AWS cli
* `export AWS_PROFILE=<your-profile-name>`
* Choose a cluster/service/task name, e.g. `$(whoami)-fs-intake-service`
    * `export CLUSTER_NAME=$(whoami)-fs-intake-cluster`
    * `export SERVICE_NAME=$(whoami)-fs-intake-service`
    * `export TASK_NAME=$(whoami)-fs-intake-task`
* Determine region to use, this assumes `us-east-1`.
* Configure ECS defaults: `ecs-cli configure --region us-east-1 --cluster $CLUSTER_NAME`
* Run CloudFormation to create VPC/subnets/IAM roles/security groups/ECS cluster: `ecs-cli up --capability-iam --size 2 --instance-type t2.small`
    ```
VPC created: vpc-aabbccdd
Security Group created: sg-a0b0c0d0
Subnet created: subnet-ddeeff00
Subnet created: subnet-abababab
```
    * Note the VPC, store as `export VPC_ID=<vpc-from-above>`
    * Note the subnets, store as `export SUBNET1=<subnet-as-above>`, same for SUBNET2
    * Note the security group, store as SECURITY_GROUP
    * Optional: add `--keypair $(whoami).id_rsa` if you need access to the ECS EC2 instances, requires an EC2 keypair to already be setup, e.g.:
        ```
aws ec2 import-key-pair --key-name $(whoami).id_rsa --public-key-material "$(cat ~/.ssh/id_rsa.pub)"
```

* Create ECR repo (note the repo URI for later):
    ```
aws ecr create-repository --repository-name $(whoami)-fs-intake-server
aws ecr create-repository --repository-name $(whoami)-fs-intake-frontend
```
* Create ELB for HTTP + HTTP:81 access: `aws elb create-load-balancer --load-balancer-name $SERVICE_NAME --listeners Protocol="TCP,LoadBalancerPort=80,InstanceProtocol=TCP,InstancePort=4200" Protocol="TCP,LoadBalancerPort=81,InstanceProtocol=TCP,InstancePort=8080" --subnets $SUBNET1 $SUBNET2 --security-groups $SECURITY_GROUP
    * Once the ELB is available in the AWS EC2 console, verify that two listeners are setup and modify the Health Check to be more permissive, the frontend can take a few minutes to be available because of the `webpack` compile.
* The default security group created needs to be expanded to allow port 81, 8080, 4200, and 22.
* Create initial task definition (see Create ECS task, below) - then create ECS service: `aws ecs create-service --service-name $SERVICE_NAME --cluster $CLUSTER_NAME --task-definition $TASK_NAME --load-balancer "loadBalancerName=$SERVICE_NAME,containerName=fs-intake-server,containerPort=8080" --desired-count 1`

# Build/Deploy
* Build frontend/server images locally: `docker-compose -f docker-compose.deploy.yml build`
* Tag images for ECR, your ECR repo URI will be different.
    ```
docker tag docker_fs-intake-server:latest 733393250814.dkr.ecr.us-east-1.amazonaws.com/$(whoami)-fs-intake-server:latest
docker tag docker_fs-intake-frontend:latest 733393250814.dkr.ecr.us-east-1.amazonaws.com/$(whoami)-fs-intake-frontend:latest
```
* ECR login (so you can use `docker push`): `$(aws ecr get-login --no-include-email --region us-east-1)`
* Push images to ECR:
    ```
docker push 733393250814.dkr.ecr.us-east-1.amazonaws.com/$(whoami)-fs-intake-server:latest
docker push 733393250814.dkr.ecr.us-east-1.amazonaws.com/$(whoami)-fs-intake-frontend:latest
```
* Update the image URIs in `ecs-compose.yml` to match your ECR URIs
* Create ECS task: `ecs-cli compose --file ecs-compose.yml --project-name $TASK_NAME --verbose create`
* Update service:
    ```
aws ecs update-service --service $SERVICE_NAME --cluster $CLUSTER_NAME --task-definition $TASK_NAME --desired-count 0
sleep 60
aws ecs update-service --service $SERVICE_NAME --cluster $CLUSTER_NAME --task-definition $TASK_NAME --desired-count 1
```
