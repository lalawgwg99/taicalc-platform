"""
簡單服務堆疊 (Simple Service Stack)
展示 cloud-architect power 的最佳實踐
"""

from dataclasses import dataclass
from aws_cdk import (
    Stack,
    StackProps,
    Duration,
    RemovalPolicy,
    aws_s3 as s3,
    aws_lambda as _lambda,
    aws_iam as iam,
)
from constructs import Construct


@dataclass
class SimpleServiceStackProps(StackProps):
    """堆疊屬性配置類別"""
    bucket_name_prefix: str
    lambda_memory_size: int
    lambda_timeout: int


class SimpleServiceStack(Stack):
    """
    簡單服務堆疊
    包含 S3 儲存桶和 Lambda 函數的基本範例
    """

    def __init__(
        self, 
        scope: Construct, 
        construct_id: str, 
        props: SimpleServiceStackProps,
        **kwargs
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # 創建 S3 儲存桶
        self.bucket = s3.Bucket(
            self,
            "DataBucket",  # 邏輯 ID
            bucket_name=f"{props.bucket_name_prefix}-{self.account}-{self.region}",
            versioned=True,  # 啟用版本控制
            encryption=s3.BucketEncryption.S3_MANAGED,  # 伺服器端加密
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,  # 阻止公開存取
            removal_policy=RemovalPolicy.DESTROY,  # 開發環境可刪除
            auto_delete_objects=True  # 自動刪除物件
        )

        # 創建 Lambda 執行角色
        lambda_role = iam.Role(
            self,
            "LambdaExecutionRole",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "service-role/AWSLambdaBasicExecutionRole"
                )
            ]
        )

        # 授予 Lambda 對 S3 儲存桶的讀寫權限
        self.bucket.grant_read_write(lambda_role)

        # 創建 Lambda 函數
        self.lambda_function = _lambda.Function(
            self,
            "ProcessorFunction",  # 邏輯 ID
            runtime=_lambda.Runtime.PYTHON_3_11,  # Python 執行環境
            handler="index.handler",  # 處理程序入口點
            code=_lambda.Code.from_inline(self._get_lambda_code()),  # 內嵌程式碼
            role=lambda_role,  # 執行角色
            memory_size=props.lambda_memory_size,  # 記憶體大小
            timeout=Duration.seconds(props.lambda_timeout),  # 逾時設定
            environment={
                "BUCKET_NAME": self.bucket.bucket_name,  # 環境變數
                "LOG_LEVEL": "INFO"
            }
        )

    def _get_lambda_code(self) -> str:
        """
        取得 Lambda 函數的程式碼
        在實際專案中，這應該從檔案載入
        """
        return """
import json
import boto3
import os
import logging

# 設定日誌記錄
logger = logging.getLogger()
logger.setLevel(os.environ.get('LOG_LEVEL', 'INFO'))

# 初始化 S3 客戶端
s3_client = boto3.client('s3')

def handler(event, context):
    \"\"\"
    Lambda 處理程序函數
    處理 S3 事件並執行簡單的資料處理
    \"\"\"
    try:
        bucket_name = os.environ['BUCKET_NAME']
        
        # 記錄收到的事件
        logger.info(f"收到事件: {json.dumps(event)}")
        
        # 簡單的處理邏輯
        response_data = {
            'statusCode': 200,
            'message': '成功處理請求',
            'bucket': bucket_name,
            'timestamp': context.aws_request_id
        }
        
        logger.info(f"處理完成: {response_data}")
        
        return {
            'statusCode': 200,
            'body': json.dumps(response_data, ensure_ascii=False)
        }
        
    except Exception as e:
        logger.error(f"處理錯誤: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': '內部伺服器錯誤',
                'message': str(e)
            }, ensure_ascii=False)
        }
"""