# DiscussionTool

This is a DiscussionTool app that is used in conjunction with [BitsAndPieces](https://github.com/learning-layers/BitsAndPieces) and Living Documents as part of the Study.

Current versions allows to create discussions for `BitsAndPieces` episodes. Attach `LivingDocuments` document to each discussion and also navigate into `Living Documents` to work with that document.

All the tools should be configured to use `OpenID Connect` (OIDC) as the means of authentication.

The tools also requires [SocialSemanticServer](https://github.com/learning-layers/SocialSemanticServer) instance being present. The instance should also be used by all the other tools.

## Requirements

  * `OpenID Connect` instance present and configured (client created)
  * `BitsAndPieces` location being configured; version 4.0.5 or greater is required
  * `LivingDocuments` Client and Service are required; version LATEST is required
  * `SocialSemanticServer` REST API; version 12.0.0 is required (newer versions could also work, provided there were no breaking changes to the API)

## Build & development

Run `grunt` for building and `grunt serve` for preview.

**Please make sure that you fill the config with the correct data.**
Configuration file is located in `app/scripts/services/config.js`

## Testing

Running `grunt test` will run the unit tests with karma.

## Usage

Please navigate to the APP_BASE_URL/#/auth/ENTITY_URI
**Please note that ENTITY_URI should be double encoded, this means it is
required to apply encodeURIComponent() two times.**
This is required so that Angular would allow a URL/URI as a parameter.

This will trigger the authentication and redirect to the OpenID Connect service.
Current implementation uses a route for that and you will see notifications about
current authentication step along the way (errors will also be shown).

In case authentication expires the application will automatically restart the
authentication phase. In case OpenID Connect still remembers the user it will
be seamless.

## Package Configuration

Created distributive has a configurator script included. With help of that it is
possible to replace configuration placeholders. It is a Shell script named
**configurator.sh**. The only requirement is that **sed** is installed. it could
be ran with **sh configurator.sh** and removed once the job is done.

## Credits

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.
