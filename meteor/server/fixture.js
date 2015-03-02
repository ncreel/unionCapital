Meteor.startup(function () {

  //Seeding Partner Organizations
  if(PartnerOrgs.find().count() === 0) {
    var partnerOrgs = [
      "KIPP Academy",
      "Thrive in Five",
      "Rosie's Place"
    ];

    _.each(partnerOrgs, function(org) {
      PartnerOrgs.insert({name: org, deleteInd: false});
    });
  }

  //Seeding Income Brackets
  if(IncomeBrackets.find().count() === 0) {
    var incomeBrackets = [
      "0-9,999",
      "10,000-19,999",
      "20,000-24,999",
      "25,000-29,999",
      "30,000-39,999",
      "40,000-49,999",
      "50,000+"
    ];

    _.each(incomeBrackets, function(bracket) {
      IncomeBrackets.insert({bracket: bracket, deleteInd: false});
    });
  }

  //Seeding Number of Kids
  if(Kids.find().count() === 0) {
    var kids = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10+'
    ];

    _.each(kids, function(kid) {
      Kids.insert({number: kid, deleteInd: false});
    });
  }
  //Seeding Races
  if(Races.find().count() === 0) {
    var races = [
      'African-American or Black',
      'White',
      'Alaskan Native or American Indian',
      'Asian',
      'Hawaiian Native or Pacific Islander',
      'Other',
      '2+ Races'
    ];

    _.each(races, function(race) {
      Races.insert({name: race, deleteInd: false});
    });
  }
  //Seeding Ethnicities
  if(Ethnicities.find().count() === 0) {
    var ethnicities = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10+'
    ];

    _.each(ethnicities, function(ethnicity) {
      Ethnicities.insert({name: ethnicity, deleteInd: false});
    });
  }
  //Seeding event categories 
  if(EventCategories.find().count() === 0) {
    var eventCategories = 
      ['Education (Child/Adult)',
        'Health (Physical & Mental)',
        'Finances/Employment',
        'Community & Service'
    ];
    _.each(eventCategories, function(category) {
      EventCategories.insert({category: category});
    });
  }

  //Seeding affiliate organizations
  if(EventOrgs.find().count() === 0) {
    var organizations = 
      [ 'Other',
        'BMC Health Net Plan',
        'Codman Academy',
        'Codman Health Center',
        'FII',
        'Kipp Boston',
        'Nurtury',
        'Thrive in 5'
    ];

    _.each(organizations, function(organization) {
      EventOrgs.insert({organization: organization});
    });
  }

  // Users fixture
  if ( Meteor.users.find().count() === 0 ) {
    var users = [
      {
         email: "admin@gmail.com", username: "admin", password: "admin",
         name: "admin", roles:['admin']
      },
      {
        email: "user@gmail.com", username: "user", password: "user", 
        profile: {
          firstName: 'Test',
          lastName: 'User',
          street: '10 Emerson',
          city: 'Boston',
          state: 'MA'
        },
        roles:['user']
      },
      {
        email: "partnerAdmin@gmail.com", username: "partnerAdmin",
        password: "partnerAdmin",
        profile: {
          firstName: 'KIPP',
          lastName: 'Academy',
          street: 'Warren Street',
          city: 'Boston',
          state: 'MA',
          zip: '02119'
        },
        roles: ['partnerAdmin']
      }
    ];

    _.each(users, function(user){
      var id = Accounts.createUser({
        email: user.email,
        password: user.password,
        profile: user.profile,
      });

      Roles.addUsersToRoles(id, user.roles);

    });
  }
  //Events fixture
  if ( Events.find().count() === 0 ) {
    //NOTE: months are 0 based for dates
    var events = [
      {
        name: 'Cambridge Science Festival',
        address: '1 Kendall Sq, Cambridge, MA',
        latitude: '42.3677845',
        longitude: '-71.0899675',
        url: 'http://example.com/CSF',
        description: 'A festival of science for everybody',
        active: 1,
        startDate: new Date(2014,9,30,16,30),
        endDate: new Date(2014,9,30,17,30),
        isPointsPerHour: true,
        pointsPerHour: 100
      },
      {
        name: 'Somerville Cooking Festival',
        address: '189 Massachusetts Ave, Somerville, MA',
        latitude: '42.3453621',
        longitude: '-71.0871995',
        url: 'http://example.com/SCF',
        description: 'A festival of cooking for the masses',
        active: 1,
        startDate: new Date(),
        endDate: new Date(),
        isPointsPerHour: false,
        points: 50
      },
      {
        name: 'Boston Music Festival',
        address: '26 Vassar St, Boston, MA',
        latitude: '42.2999257',
        longitude: '-71.0773658',
        url: 'http://example.com/BMF',
        description: 'Music festival; all styles - join us soon!',
        active: 1,
        startDate: new Date(2014,10,6,17,30),
        endDate: new Date(2014,10,6,19,30),
        isPointsPerHour: true,
        pointsPerHour: 100
      },
      {
        name: 'Cambridge Film Festival',
        address: '18 Davis Sq, Somerville, MA',
        latitude: '42.3966813',
        longitude: '-71.1226578',
        url: 'http://example.com/CFF',
        description: 'Watch as many films as you can in just 3 days of mandness!',
        active: 1,
        startDate: new Date(2014,10,15,13,30),
        endDate: new Date(2014,10,15,17,30),
        isPointsPerHour: false,
        points: 150
      },
      //This is quite hacky, but the below event only exists to allow admins to add
      //transactions linked to this event. Basically we'll adjust the hours / minutes
      //to give the appropriate number of points an admin gives
      {
        name: 'Admin Add Points',
        address: 'Boston, MA',
        url: 'unioncapitalboston.com',
        description: 'Union Capital administrator adding points to your account',
        active: 0,
        startDate: new Date(1900,1,1,1,1),
        endDate: new Date(1900,1,1,1,1),
        isPointsPerHour: true,
        pointsPerHour: 100
      }
    ];

    _.each(events, function(event){
      Events.insert({
        name: event.name,
        address: event.address,
        latitude: event.latitude,
        longitude: event.longitude,
        url: event.url,
        description: event.description,
        active: event.active,
        startDate: event.startDate,
        endDate: event.endDate,
        isPointsPerHour: event.isPointsPerHour,
        points: event.points,
        pointsPerHour: event.pointsPerHour
      });
    });
  }
});