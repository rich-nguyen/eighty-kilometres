package controllers

import play.api.mvc._
import common.ExecutionContexts
import play.api.Play
import play.api.libs.iteratee.Enumerator

object AssetContentController extends Controller with ExecutionContexts {

    def loadAsset(path: String): Action[AnyContent]  = Action { implicit request =>
      val assetpath = Play.classloader(Play.current).getResource(path)
      val resolved = assetpath.toURI.toURL

      Result(
        ResponseHeader(OK, Map(CONTENT_TYPE -> BINARY)),
        Enumerator.fromStream(resolved.openStream())
      )
    }

}