#!/bin/sh
# This configurator script will prompt for confguration data and then replace
# configuration placeholders as needed.
# Running: sh configurator.sh
# Just follow the instructions afterwards

echo "\033[32mHi, I am a configuration filler script.\033[m"

echo "Please specify full path to distributive, leave empty in case of current directory."

read -r -p "Location (without ending slash): " dtDistLocation

if [ "$dtDistLocation" = "" ]; then
  dtDistLocation=`pwd`
fi

# OIDC_AUTHORIZATION_URL
read -r -p "OIDC authorization URL (without trailing slash): " dtOidcAuthorizationUrl
# OIDC_CLIENT_ID
read -r -p "OIDC client identifier: " dtOidcClientId
# SSS_REST_URL
read -r -p "SSS REST URL (with trailing slash): " dtSssRestUrl
# LD_DOCUMENT_BASE
read -r -p "Living Documents DOCUMENT BASE (with trailing slash): " dtLdDocumentBase
# LD_REST_URL
read -r -p "Living Documents REST URL (with trailing slash): " dtLdRestUrl
# LD_CLIENT_URL
read -r -p "Living Documents Client URL (with trailing slash): " dtLdClientUrl
# BNP_URL
read -r -p "BitsAndPieces URL (with trailing slash): " dtBnpUrl

echo "The data you have entered that will be used for by configurator. \033[31mPlease check!\033[m"

echo "
Distributive Directory: \033[35m$dtDistLocation\033[m
OIDC_AUTHORIZATION_URL: \033[35m$dtOidcAuthorizationUrl\033[m
OIDC_CLIENT_ID:         \033[35m$dtOidcClientId\033[m
SSS_REST_URL:           \033[35m$dtSssRestUrl\033[m
LD_DOCUMENT_BASE:       \033[35m$dtLdDocumentBase\033[m
LD_REST_URL:            \033[35m$dtLdRestUrl\033[m
LD_CLIENT_URL:          \033[35m$dtLdClientUrl\033[m
BNP_URL:                \033[35m$dtBnpUrl\033[m"

read -r -p "Does it look correct? [Y/y/N/n] " dtResponse

if [ $dtResponse != 'Y' ] && [ $dtResponse != 'y' ]; then
  echo "\n\033[31mAborting!\033[m"
  exit 1
fi

echo "\nRunning configuration replacements"
# Replace configurations as needed
cd scripts/

# A small patch to sed inline for OS X
sedCommand="sed -i"
if [ `uname -s` = "Darwin" ]; then
  echo "DARWINN"
  sedCommand="$sedCommand ''"
fi

$sedCommand "s#OIDC_AUTHORIZATION_URL#${dtOidcAuthorizationUrl}#g" scripts.*.js
$sedCommand "s#OIDC_CLIENT_ID#${dtOidcClientId}#g" scripts.*.js
$sedCommand "s#SSS_REST_URL#${dtSssRestUrl}#g" scripts.*.js
$sedCommand "s#LD_DOCUMENT_BASE#${dtLdDocumentBase}#g" scripts.*.js
$sedCommand "s#LD_REST_URL#${dtLdRestUrl}#g" scripts.*.js
$sedCommand "s#LD_CLIENT_URL#${dtLdClientUrl}#g" scripts.*.js
$sedCommand "s#BNP_URL#${dtBnpUrl}#g" scripts.*.js
cd ..

echo "\033[32mAll done!\033[m"
