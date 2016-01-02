package common

import play.api.libs.json.Json

object Allotment {
  implicit val formats = Json.format[Allotment]
}

case class Allotment(
  owner: String,
  id: String
)