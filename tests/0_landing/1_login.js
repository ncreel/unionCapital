casper.test.comment('Logging In');

casper.test.begin('Landing Page', 9, function suite(test) {
  casper.start(homeURL, function() {
  });

  casper.waitForSelector("#loginSubmit", function() {
    test.assertHttpStatus(200, siteName + " is up");
    //buttons
    test.assertExists('#loginSubmit');
    test.assertExists('#lnkSignUp');
    test.assertExists('#facebook');
    test.assertExists('#forgotPassword');
    //text input fields
    test.assertExists('#userEmail');
    test.assertExists('#userPassword');
  });

  //TODO: this is probably a security flaw, shouldn't have password data
  //of any user in free text...
  casper.then(function() {
    this.sendKeys("#userEmail", "user@gmail.com");
    this.sendKeys("#userPassword", "user");
    this.click("#loginSubmit");
  });

  //login should take no more than 3 seconds
  casper.wait(3000, function() {
    test.assertExists("#checkInDiv");
  });

  casper.then(function() {
    casper.logout(test);
  });

  casper.run(function() {
    test.done();
  });
});


