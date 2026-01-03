"""
堆疊單元測試
遵循 cloud-architect power 的測試最佳實踐
"""

import pytest
from aws_cdk import App, assertions
from stack import SimpleServiceStack, SimpleServiceStackProps


class TestSimpleServiceStack:
    """簡單服務堆疊的單元測試"""

    def setup_method(self):
        """測試設定"""
        self.app = App()
        self.props = SimpleServiceStackProps(
            bucket_name_prefix="test-service",
            lambda_memory_size=128,
            lambda_timeout=30
        )
        self.stack = SimpleServiceStack(
            self.app, 
            "test-stack", 
            props=self.props
        )
        self.template = assertions.Template.from_stack(self.stack)

    def test_s3_bucket_created(self):
        """測試 S3 儲存桶是否正確創建"""
        # 驗證 S3 儲存桶存在
        self.template.has_resource_properties(
            "AWS::S3::Bucket",
            {
                "VersioningConfiguration": {
                    "Status": "Enabled"
                },
                "BucketEncryption": {
                    "ServerSideEncryptionConfiguration": [
                        {
                            "ServerSideEncryptionByDefault": {
                                "SSEAlgorithm": "AES256"
                            }
                        }
                    ]
                },
                "PublicAccessBlockConfiguration": {
                    "BlockPublicAcls": True,
                    "BlockPublicPolicy": True,
                    "IgnorePublicAcls": True,
                    "RestrictPublicBuckets": True
                }
            }
        )

    def test_lambda_function_created(self):
        """測試 Lambda 函數是否正確創建"""
        # 驗證 Lambda 函數存在
        self.template.has_resource_properties(
            "AWS::Lambda::Function",
            {
                "Runtime": "python3.11",
                "Handler": "index.handler",
                "MemorySize": 128,
                "Timeout": 30
            }
        )

    def test_lambda_has_s3_permissions(self):
        """測試 Lambda 函數是否有 S3 權限"""
        # 驗證 IAM 政策存在
        self.template.has_resource_properties(
            "AWS::IAM::Policy",
            {
                "PolicyDocument": {
                    "Statement": assertions.Match.array_with([
                        assertions.Match.object_like({
                            "Effect": "Allow",
                            "Action": assertions.Match.array_with([
                                "s3:GetObject*",
                                "s3:GetBucket*",
                                "s3:List*",
                                "s3:DeleteObject*",
                                "s3:PutObject",
                                "s3:PutObjectLegalHold",
                                "s3:PutObjectRetention",
                                "s3:PutObjectTagging",
                                "s3:PutObjectVersionTagging",
                                "s3:Abort*"
                            ])
                        })
                    ])
                }
            }
        )

    def test_lambda_environment_variables(self):
        """測試 Lambda 環境變數設定"""
        # 驗證環境變數設定
        self.template.has_resource_properties(
            "AWS::Lambda::Function",
            {
                "Environment": {
                    "Variables": {
                        "LOG_LEVEL": "INFO"
                        # BUCKET_NAME 會是動態參考，所以不在這裡測試
                    }
                }
            }
        )

    def test_resource_count(self):
        """測試資源數量"""
        # 驗證創建的資源數量符合預期
        self.template.resource_count_is("AWS::S3::Bucket", 1)
        self.template.resource_count_is("AWS::Lambda::Function", 1)
        self.template.resource_count_is("AWS::IAM::Role", 1)
        self.template.resource_count_is("AWS::IAM::Policy", 1)