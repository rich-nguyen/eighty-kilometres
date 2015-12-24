package com.gamex

import sbt.{Build, Project}
import sbt.Keys._
import sbt.file
import play.PlayScala

object EightyKilometres extends Build {

    val compilationSettings = Seq(
        organization := "com.gamex",
        maxErrors := 20,
        javacOptions := Seq("-g","-encoding", "utf8"),
        scalacOptions := Seq("-unchecked", "-deprecation", "-target:jvm-1.8",
            "-Xcheckinit", "-encoding", "utf8", "-feature", "-Yinline-warnings","-Xfatal-warnings"),	    
        incOptions := incOptions.value.withNameHashing(true),
        scalaVersion := "2.11.7"
    )

    val root = Project("EightyKilometres", base = file("."))
        .enablePlugins(PlayScala)
        .settings(compilationSettings)

}