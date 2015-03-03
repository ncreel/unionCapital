var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
};

var fields = ['name', 'description'];

EventsSearch = new SearchSource('eventsSearch', fields, options);

var getEventsData = function() {
  return EventsSearch.getData({
    transform: function(matchText, regExp) {
      return matchText.replace(regExp, "<span style='color:red'>$&</span>");
    },
    sort: {startDate: 1}
  });
};

Template.eventsCalendar.rendered = function() {
  EventsSearch.search("");
};

Template.eventsCalendar.helpers({
  getEvents: function() {
    var events = getEventsData();
    var eventsByDate = _.groupBy(events, function(event) {
      return moment(event.startDate).format("YYYY MM DD");
    });
    return eventsByDate;
  },
  'rsvpButton': function() {
    var rsvpForEvent = Reservations.findOne({ userId: Meteor.userId(),
                                            eventId: this._id
    });
    if(rsvpForEvent) {
      return "<button type='button' class='btn btn-danger btn-sm removeReservation'>" + 
        "Remove RSVP</button>";
    } else {
      return "<button type='button' class='btn btn-default btn-sm insertReservation' " + 
        "data-toggle='modal' data-target = '#rsvpModal'>RSVP</button>";
    }
  },
  people: function() {
    return NumberOfPeople.find();
  }
});

Template.eventsCalendar.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    EventsSearch.search(text);
  }, 200),
  'click .insertReservation': function(e) {
    e.preventDefault();
    var attributes = {
      userId : Meteor.userId(),
      eventId : this._id,
      dateEntered : new Date(),
      numberOfPeople: $(e.target).closest('div').find('.numberOfPeople').val()
    };

    Meteor.call('insertReservations', attributes, function(error) {
      if(error) {
        console.log(error.reason);
      }
    });
  },
  'click .removeReservation': function(e) {
    //make server side call to remove that reservation
    var attributes = {
      userId: Meteor.userId(),
      eventId: this._id
    };
    Meteor.call('removeReservation', attributes, function(error) {
      if(error) {
        addErrorMessage(error.reason);
      } else {
        addSuccessMessage("Your reservation has been removed");
      }
    });
  },
});
