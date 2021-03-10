const { request, gql } =  require('graphql-request');
const nodemailer = require('nodemailer');
const stringify = require('json-stringify');
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')


async function main() {

  // cron.scheduleJob('15 * * * * *', function(){});
  const endpoint = 'https://www.hy-vee.com/my-pharmacy/api/graphql';

  const query = gql`
      query SearchPharmaciesNearPointWithCovidVaccineAvailability($latitude: Float!, $longitude: Float!, $radius: Int) {
        searchPharmaciesNearPoint(latitude: $latitude, longitude: $longitude, radius: $radius) {
             distance
             location {
                 locationId
                 name
                 isCovidVaccineAvailable
                 covidVaccineEligibilityTerms
                 address {
                   line1
                   line2
                   city
                   state
                   zip
                   latitude
                   longitude
                  }
            }
        }
      }
  `;

  const variables = {"radius":300,"latitude":42.0307812,"longitude":-93.63191309999999}
  const data = await request(endpoint, query, variables)

  const { searchPharmaciesNearPoint } = data;
  let pharmaciesWithVaccines = [];

  //filter through data to find ones with isCovidVaccineAvailable
  for(let val of searchPharmaciesNearPoint){
    if(val.location.isCovidVaccineAvailable){
      pharmaciesWithVaccines.push(val);
    }
  }
  // console.log(pharmaciesWithVaccines);

  //send email
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'covidchecker10000@gmail.com',
      pass: 'albertEinstein69!'
    }
  });

  var maillist = [
    'yousef.absi@gmail.com',
    'jayhawker78@gmail.com',
    'tmnesbit@iastate.edu'
  ]

  var mailOptions = {
    from: 'covidchecker10000@gmail.com',
    to: maillist,
    subject: 'Covid Vaccines Available',
    text: 'The following pharmacies are available in a ' + variables.radius + ' mile radius from Ames, Iowa: ' + stringify(pharmaciesWithVaccines, null, 1)
  };

  if(pharmaciesWithVaccines.length !== 0){
  transporter.sendMail(mailOptions, function(error, info) {
    if(error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};


}

//schedule task to run every 15 mins
setInterval(main, 900000);


main().catch((error) => console.error(error))
