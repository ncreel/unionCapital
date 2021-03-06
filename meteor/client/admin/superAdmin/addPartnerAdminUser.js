Template.addPartnerAdminUser.onRendered(function() {
  this.subscribe('partnerOrganizations');
  
});

Template.addPartnerAdminUser.helpers({
  organizations: function() {
    return PartnerOrgs.find();
  },
});

Template.addPartnerAdminUser.events({
  'click #back': function(e) {
    Router.go('partnerAdminView');
  },
  'click #submit': function(e) {
    e.preventDefault();

    var sessionProfile = Session.get("profile");

    var attributes = {
      email: $('#userEmail').val(),
      password: $('#userPassword').val(),
      profile: {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        street1 : $('#street_number').val() + " " +
          $('#route').val(),
        street2: $('#userStreetAddress2').val(),
        city: $('#locality').val(),
        state: $('#administrative_area_level_1').val(),
        zip: $('#postal_code').val(),
        partnerOrg: R.prepend($('#organizations').val(), []),
        role: 'partnerAdmin'
      }
    };
    Meteor.call('createNewUser', attributes, function(error) {
      if(error) {
        sAlert.error(error.reason);
      } else {
        sAlert.success("Successfully Created User");
        Router.go('partnerAdminView');
      }
    });
  }
});
