#!/bin/bash

# Clean built assets
pushd client
rm -rf target
mkdir -p target
gulp
popd

pushd server
sbt dist
popd

aws s3 cp --profile eighty-kilometres server/target/universal/eightykilometres-0.1-SNAPSHOT.zip s3://eightykilometres/deploys/server.zip --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
aws s3 cp --profile eighty-kilometres client/target/app.js s3://eightykilometres/deploys/assets/app.js --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
