/* global CheckIn:true */
/* global UserPhoto */
/* global ReactiveVar */

CheckIn = function(defaultHours) {
  var self = this;

  self.hours = new ReactiveVar(defaultHours);
  self.checkingIn = new ReactiveVar(false);
  self.userPhoto = new UserPhoto();
  self.eventName = null;
  self.eventDescription = null;
  self.eventDate = null;
  self.category = null;

  // Calls insertTransaction and routes the user
  // Private function
  function callInsert(attributes, callback) {
    Meteor.call( 'insertTransaction', attributes, callback );
  }

  // Sets the attributes prior to calling the insert function
  // Semiprivate function - should not be called directly
  self._insertTransaction = function(eventId, addons, imageId, callback) {

    try {
      const attributes = {
        userId: Meteor.userId(),
        hoursSpent: parseFloat(self.hours.get()) || 0,
      };

      // If new, then don't set the eventId to avoid check() errors
      if (eventId === 'new' && self.eventName && self.eventDescription && self.eventDate) {
        attributes.eventName = self.eventName;
        attributes.eventDescription = self.eventDescription;
        attributes.eventDate = self.eventDate;
        attributes.category = self.category;
      } else if (eventId && eventId !== 'new') {
        // Else set the event ID
        attributes.eventId = eventId;
      } else {
        throw new Meteor.Error('NO_EVENT_NAME', 'Please fill out all fields');
      }

      // Instead of just passing a null imageId field, this omits the field
      // entirely to stay consistent with the check() function called on the server
      if (imageId) {
        attributes.imageId = imageId;
      }

      //omits the field entirely, same as above comment
      //TODO: make this a check for empty
      if (!R.isEmpty(addons)) {
        attributes.addons = addons;
      }

      // If lat or lng is null, then try to get it one more time
      // Useful if the user accessed this page from a link or bookmark
      if (gmaps.currentLocation.lat && gmaps.currentLocation.lng) {

        attributes.userLat = gmaps.currentLocation.lat;
        attributes.userLng = gmaps.currentLocation.lng;
        callInsert(attributes, callback);

      } else {

        gmaps.getCurrentLocation(function(error, currentLocation) {

          if (!error) {
            attributes.userLat = currentLocation.lat;
            attributes.userLng = currentLocation.lng;
          }

          callInsert(attributes, callback);
        });
      }
    } catch(error) {
      // Just pass it through if it is a meteor error
      if (error.errorType === 'Meteor.Error') {
        callback(error);

      // Otherwise, create a meteor error
      // We should find a better way to log the call stack
      } else {
        console.log(error.stack);

        var meteorError = new Meteor.Error('UNEXPECTED', 'Unexpected error, please try again');
        callback(meteorError, null);
      }
    }
  };
};

//------------- Public functions -------------//

// Checks the user in
CheckIn.prototype.submitCheckIn = function(eventId, addons, callback) {
  var self = this;
  self.checkingIn.set(true);

  // This makes sure checkingIn never stays true on error
  function wrappedCallback(error, result) {
    self.checkingIn.set(false);
    callback( error, result );
  }

  // If the photo exists, use the photo ID, otherwise proceed without one
  if( self.userPhoto && self.userPhoto.photoURI.get() ) {
    self.userPhoto.insert(function(err, fileObj) {
      if ( err ) {
        wrappedCallback(err, null);
      } else {
        self._insertTransaction(eventId, addons, fileObj._id, wrappedCallback);
      }
    });
  } else {
    self._insertTransaction(eventId, addons, null, wrappedCallback);
  }
};

// Gets the base64 photo URI
CheckIn.prototype.getPhoto = function() {
  return this.userPhoto.photoURI.get();
};

// Pops up the takephoto modal
CheckIn.prototype.takePhoto = function() {
  return this.userPhoto.takePhoto();
};

// Manually set the photo URI
CheckIn.prototype.setPhoto = function(inputElement) {
  return this.userPhoto.setPhotoURI(inputElement);
};

// Removes the photo
CheckIn.prototype.removePhoto = function() {
  this.userPhoto.remove();
};

