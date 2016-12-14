# Flep! PhoneGap client

This is an example PhoneGap app, using plain old Javascript to talk to a remote REST API. Install it on your Android phone from the [Play store](https://play.google.com/store/apps/details?id=com.arrayofbytes.flep&hl=en)

* `npm install` to install phonegap
* `phonegap serve` and visit the given url to run locally in the browser.

To build the release package; try `phonegap build android -release` and have a read of [this stack overflow answer](http://stackoverflow.com/questions/26449512/how-to-create-signed-apk-file-using-cordova-command-line-interface) to sign and zipalign the package for release.
