package com.gamex

import play.sbt.PlayScala
import sbt.{Build, Project}
import sbt.Keys._
import sbt._

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

    val awsVersion = "1.10.44"
    val awsDynamodb = "com.amazonaws" % "aws-java-sdk-dynamodb" % awsVersion
    val awsCore = "com.amazonaws" % "aws-java-sdk-core" % awsVersion

    val dependencies =  Seq(
      libraryDependencies ++= Seq(
        awsCore,
        awsDynamodb
      )
    )

    val root = Project("EightyKilometres", base = file("."))
        .enablePlugins(PlayScala)
        .settings(compilationSettings)
        .settings(dependencies)

}