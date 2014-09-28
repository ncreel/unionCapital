Events = new Meteor.Collection('events');
Events.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: 'Name of Event'
  },
  address: {
    type: String,
    label: 'Address of Event'
  },
  longitude: {
    type: String,
    label: 'Longitude',
    optional: true
  },
  latitude: {
    type: String,
    label: 'Latitude',
    optional: true
  },
  description: {
    type: String,
    label: 'Description of Event'
  },
  active: {
    type: Number,
    label: 'Is event active?',
    allowedValues: [0,1],
    defaultValue: 1
  },
  startDate: {
    type: Date,
    label: 'Start of Event'
  },
  endDate: {
    type: Date,
    label: 'End of Event'
  },
  points: {
    type: Number,
    label: 'Amount of Points',
    optional: true
  },
  isPointsPerHour: {
    type: Boolean,
    label: 'Points per Hour?'
  },
  pointsPerHour: {
    type: Number,
    label: 'Points per Hour',
    optional: true
  },
  url: {
    type: String,
    label: 'URL to the event',
    optional: true
  }
}));

Events.currentEvents = function(offset) {
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);
  var offsetDate = new Date(currentDate);
  console.log("Event offset date: " + offsetDate);

  //the offset defaults to one week ahead
  return Events.find({startDate: {'$lte': offsetDate}, 
                     endDate: {'$lte': offsetDate}, 
                     active: 1},
                     {sort: {startDate: 1}});
};

Events.upcomingEvents = function() {
  return Events.find({startDate: {'$gt': new Date()}, active: 1},
                     {sort: {startDate: 1}});
};

Events.allEvents = function() {
  return Events.find({endDate: {'$gte': new Date()}, active: 1},
                     {sort: {startDate: 1}});
};

Events.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  },
});
