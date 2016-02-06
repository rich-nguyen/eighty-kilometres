package common

import play.api.{Play, Mode}

object AssetLoader {

  private case class AssetPath(
    path: String,
    devPath: String,
    prodPath: String)

  private val assets = List(
    AssetPath(
      "app.js",
      "http://localhost:8000/app.js",
      "https://s3-eu-west-1.amazonaws.com/eightykilometres/deploys/assets/app.js")
  )

  def getPath(path: String): Option[String] = {
    val maybePath = assets.find(_.path == path)
    maybePath.map { asset =>
      if (Play.current.mode == Mode.Prod) {
        asset.prodPath
      } else {
        asset.devPath
      }
    }
  }
}