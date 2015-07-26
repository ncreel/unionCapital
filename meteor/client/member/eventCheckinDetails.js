var defaultHours = 1;
var checkIn = {};

Template.eventCheckinDetails.created = function() {
  checkIn = new CheckIn(defaultHours);
};

Template.eventCheckinDetails.rendered = function() {
  addPlugins();
};

Template.eventCheckinDetails.helpers({

  'timeAttending': function() {
    return checkIn ? checkIn.hours.get() : defaultHours;
  },

  'hasPhoto': function() {
    return checkIn ? checkIn.getPhoto() : false;
  },

  checkingIn: function() {
    if (checkIn && checkIn.checkingIn.get())
      return 'none';
  },

  recognized: function() {
    return !(Router.current().params.id === 'new');
  },

  categories: function() {
    return EventCategories.find();
  }
});

Template.eventCheckinDetails.events({

  'change #durationSlider': function() {
    checkIn.hours.set($('#durationSlider').val());
  },

  'click #addPhoto': function(e) {
    e.preventDefault();
    // checkIn.takePhoto();
    $('#upPhoto').click();
  },

  'click #ucbButton': function(e) {
    checkIn.hasUCBButton = $('#ucbButton').prop('checked');
  },

  'change #upPhoto':  function() {
    var input = $('#upPhoto')[0];

    if (input.files && input.files[0])
      checkIn.setPhoto(input.files[0]);
    else
      checkIn.removePhoto();
  },

  // Async, pass the checkin
  'click .check-in': function(e) {
    e.preventDefault();
    //defaults to true b/c only ad-hoc events need checking
    var isValid = true;

    var eventId = Router.current().params.id;

    // Set the event name if it is an ad hoc transaction
    if (eventId === 'new') {
      checkIn.eventName = $('#eventName').val();
      checkIn.eventDescription = $('#eventDescription').val();
      checkIn.category = $('#categories').val();
      checkIn.eventDate = new Date($('#adHocEventDate').val());

      //Validate form
        $('#eventDescForm').validate();
        $('#organizationForm').validate();
        $('#adHocEventDate').validate();

        isValid = $('#eventDescForm').valid() && $('#organizationForm').valid() &&
          $('#adHocEventDate').valid();
    }

    // Do the form validation here, then call the submit function
    if(isValid) {
      checkIn.submitCheckIn(eventId, function(error, result) {
        if(error) {
          addErrorMessage(error.reason);
        } else {
          if (result  === 'not_allowed') {
            addErrorMessage('This type of check-in is not allowed');
          } else if (result === 'auto') {
            addSuccessMessage('Sucessfully checked in!');
            Router.go('memberHomePage');
          } else {
            addSuccessMessage('Check-in submitted for approval');
            Router.go('memberHomePage');
          }
        }
      });
    }
    return false;
  },

  'click #back': function(e) {
    e.preventDefault();
    Router.go('checkin');
  },

  'click #photoPanel': function() {
    checkIn.removePhoto();
  }
});

Template.eventCheckinDetails.destroyed = function () {
  //TODO: JSLint gives an error here saying we shouldn't delete vars
  //maybe we should just assign it to an empty object?
  delete checkIn;
};

function validateFields() {
  return $('#eventName').val() && $('#eventDescription').val();
}

function addPlugins() {
  $('#durationSlider').noUiSlider({
    start: [defaultHours],
    range: {
      min: [0],
      max: [8]
    },
    step: 0.5,
    format: wNumb({
      decimals: 1
    })
  });

  $('#durationSlider').noUiSlider_pips({
    mode: 'values',
    values: [0,1,2,3,4,5,6,7,8]
  });

  $('.input-group.date').datepicker({
    autoclose: true,
    todayHighlight: true,
    orientation: 'top'
  });
}
