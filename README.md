# discussion-tool

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

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
