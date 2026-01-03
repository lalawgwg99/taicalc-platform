#!/usr/bin/env python3
"""
CDK 應用程式入口點
遵循 cloud-architect power 的最佳實踐
"""

import aws_cdk as cdk
from constructs import Construct
from stack import SimpleServiceStack, SimpleServiceStackProps

# 創建 CDK 應用程式
app = cdk.App()

# 開發環境配置
dev_props = SimpleServiceStackProps(
    bucket_name_prefix="simple-service-dev",
    lambda_memory_size=128,
    lambda_timeout=30
)

# 生產環境配置
prod_props = SimpleServiceStackProps(
    bucket_name_prefix="simple-service-prod", 
    lambda_memory_size=256,
    lambda_timeout=60
)

# 部署開發環境
SimpleServiceStack(
    app, 
    "simple-service-dev",
    props=dev_props,
    env=cdk.Environment(
        account="123456789012",  # 替換為您的 AWS 帳戶 ID
        region="us-east-1"
    )
)

# 部署生產環境
SimpleServiceStack(
    app,
    "simple-service-prod", 
    props=prod_props,
    env=cdk.Environment(
        account="123456789012",  # 替換為您的 AWS 帳戶 ID
        region="us-east-1"
    )
)

app.synth()