package common

import com.amazonaws.auth._
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.regions.{Region, Regions}
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBAsyncClient
import com.amazonaws.services.dynamodbv2.model.{GetItemRequest, AttributeValue}
import scala.collection.JavaConverters._

object DynamoDB {


  val credentials = new AWSCredentialsProviderChain(
    new EnvironmentVariableCredentialsProvider(),
    new SystemPropertiesCredentialsProvider(),
    new ProfileCredentialsProvider("eighty-kilometres"),
    new InstanceProfileCredentialsProvider
  )

  private val tableName = "allotments"
  private val client = new AmazonDynamoDBAsyncClient(credentials)
  client.setRegion(Region.getRegion(Regions.EU_WEST_1))

  def getAllotments: Seq[Allotment] = {

    val getItemRequest = new GetItemRequest()
      .withTableName(tableName)
      .withKey(Map[String, AttributeValue](
        ("id", new AttributeValue().withS("allotment1")),
        ("owner", new AttributeValue().withS("me"))
      ).asJava)

    val result = client.getItem(getItemRequest)

    val item = result.getItem
    Seq(
      Allotment(
        item.get("id").getS,
        item.get("owner").getS
      )
    )
  }
}