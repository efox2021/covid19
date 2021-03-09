const { request, gql } =  require('graphql-request');

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

  const variables = {"radius":100,"latitude":42.0307812,"longitude":-93.63191309999999}
  const data = await request(endpoint, query, variables)

  const { searchPharmaciesNearPoint } = data;

  //filter through data to find ones with isCovidVaccineAvailable
  //send email
  //schedule task to run every 15 mins?
}

main().catch((error) => console.error(error))


x = `
`
