package controllers

import play.api.mvc._
import common.ExecutionContexts

object WorldViewController extends Controller with ExecutionContexts {

    def index = Action { implicit request =>
        Ok(views.html.worldview.index())
    }

    def allotmentPlan = Action {
      Ok("Hello, I am the World View page.")
    }

}