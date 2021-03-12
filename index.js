const { request, gql } =  require('graphql-request');
const nodemailer = require('nodemailer');
const stringify = require('json-stringify');
require('dotenv').config()

async function main() {

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

  const variablesAmes = {"radius":75,"latitude":44.9778,"longitude":-93.2650}
  const variablesDSM = {"radius":75,"latitude":41.5868353,"longitude":-93.6249593}
  const dataAmes = await request(endpoint, query, variablesAmes)
  const dataDSM = await request(endpoint, query, variablesDSM)

  const ames = dataAmes.searchPharmaciesNearPoint;
  const dsm = dataDSM.searchPharmaciesNearPoint;
  let pharmaciesWithVaccinesAmes = [];
  let pharmaciesWithVaccinesDSM = [];


  //filter through dataAmes to find ones with isCovidVaccineAvailable
  for(let val of ames){
    if(val.location.isCovidVaccineAvailable){
      pharmaciesWithVaccinesAmes.push(val);
    }
  }

  //filter through dataAmes to find ones with isCovidVaccineAvailable
  for(let val of dsm){
    if(val.location.isCovidVaccineAvailable){
      pharmaciesWithVaccinesDSM.push(val);
    }
  }
  // console.log(pharmaciesWithVaccinesAmes);

  //send email
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });

  var maillist = [
    'jayhawker78@gmail.com',
    'Diane.m.hubbell@gmail.com',
    'Jvnesbit@gmail.com'
  ]

  var maillist2 = [
    'jayhawker78@gmail.com',
    'Carrie@iowarealty.com',
    'Brett.t.omeara@gmail.com',
    'Jmpnesbit@gmail.com',
    'Wmnesbit19@gmail.com',
    'mollyfenske@gmail.com',
    'ericanesbit3@gmail.com',
    'Lindanesbit@mchsi.com',
    'Debmiller@iowarealty.com'
  ]

  var mailOptions = {
    from: 'covidchecker10000@gmail.com',
    to: maillist,
    subject: 'Covid Vaccines Available',
    text: 'The following pharmacies are available in a ' + variablesAmes.radius + ' mile radius from Minneapolis, MN: ' + stringify(pharmaciesWithVaccinesAmes, null, 1) + '\n Visit https://www.hy-vee.com/my-pharmacy/covid-vaccine-consent for more info'
  };

  var mailOptions2 = {
    from: 'covidchecker10000@gmail.com',
    to: maillist2,
    subject: 'Covid Vaccines Available',
    text: 'The following pharmacies are available in a ' + variablesDSM.radius + ' mile radius from Des Moines, Iowa: ' + stringify(pharmaciesWithVaccinesDSM, null, 1) + '\n Visit https://www.hy-vee.com/my-pharmacy/covid-vaccine-consent for more info'
  };

  if(pharmaciesWithVaccinesAmes.length !== 0){
  transporter.sendMail(mailOptions, function(error, info) {
    if(error) {
      console.log(error);
    } else {
      console.log('Email sent to Minneapolis Group: ' + info.response);
    }
  });
};

if(pharmaciesWithVaccinesDSM.length !== 0){
transporter.sendMail(mailOptions2, function(error, info) {
  if(error) {
    console.log(error);
  } else {
    console.log('TEST: Email sent to DSM Group: ' + info.response);
  }
});
};


}

//schedule task to run every 15 mins
// setInterval(main, 900000);

//schedule task to run every 5 mins
 setInterval(main, 300000);


main().catch((error) => console.error(error))
