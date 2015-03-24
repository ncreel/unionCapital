UI.registerHelper('formatDate', function(unformattedDate) {
    if(moment(unformattedDate).isValid()) {
      return moment(unformattedDate).format('MMMM DD hh:mm A');
    } else {
      return "";
    }
});

UI.registerHelper('justTime', function(unformattedDate) {
    return moment(unformattedDate).format('hh:mm A');
});

UI.registerHelper("eventOptions", function() {
  return _.chain(Events.find().fetch())
          .map(function(event){
            return { label: event.name, value: event._id };
          }).value();
});

//handlebars supports iterating over object keys, but 
//Meteor currently does not. This gives Meteor this ability
UI.registerHelper("arrayify", function(obj) {
  result = [];
  for (var key in obj) {
    result.push({name: key, value: obj[key]});
  }
  return result;
});

// Returns a single date if both startdate and enddate are on the same day
UI.registerHelper('formatEventDate', function(unformattedStartDate, unformattedEndDate) {

  var startDate = moment(unformattedStartDate).isValid() ? moment(unformattedStartDate).format('M/D/YY hh:mm A') : '';
  var endDate = moment(unformattedEndDate).isValid() ? moment(unformattedEndDate).format('M/D/YY hh:mm A') : '';

  var finalDateString = startDate + endDate;

  // If both are not empty, then return a single day or a range
  // If at least one is empty, then it will return the concatenation of the two
  // which will be either an empty string or the single good day
  if (startDate && endDate) {
    if (moment(startDate).isSame(endDate, 'day'))
      finalDateString = startDate; 
    else
      finalDateString = startDate + ' - ' + endDate;
  }
  return finalDateString;
});