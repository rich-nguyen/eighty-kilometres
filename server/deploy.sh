#!/bin/bash

aws s3 cp --profile eighty-kilometres target/universal/eightykilometres-0.1-SNAPSHOT.zip s3://eightykilometres/deploys/server.zip --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
