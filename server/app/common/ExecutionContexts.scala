package common

import play.api.libs.concurrent.{Akka => PlayAkka}
import scala.concurrent.duration._
import play.api.Play
import scala.concurrent.ExecutionContext
import akka.actor.ActorSystem
import play.api.Play.current

trait ExecutionContexts {
  implicit lazy val executionContext: ExecutionContext = play.api.libs.concurrent.Execution.Implicits.defaultContext
  lazy val actorSystem: ActorSystem = PlayAkka.system
}
