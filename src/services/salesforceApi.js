const axios = require('axios').default;

describe("Salesforce Api", () => {
    //@HttpGET
    it("Get all memberships", async () => {
      const query = "SELECT Id, Name FROM Auctifera__Membership_Programs__c";
      const authUrl = "https://login.salesforce.com/services/oauth2/token";
      const apiUrl = `https://veevqaone.my.salesforce.com/services/data/v50.0/query?q=${query}`;

      const clientId = "3MVG93inh8Bkz5nZ1tqHi0_5ZF2VXf3c6Sg2eEbuBPXBR94_Q_zRZvJhRmhups22W2AugELZLGFlJ1JXC0VVg";
      const clientSecret = "CF3C5752E95B662EA9F02CB3AD8A6D05C2DDF1C2EFD96AED5D48A03BDFC249BD";
      const username = "dev@veevqaone.com";
      const password = "Veevart2024";
    
      //parameters
      const authParams = new URLSearchParams({
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username: username,
        password: password,
      });
    
      try {
       
        const response = await axios.post(authUrl, authParams.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      
        const accessToken = response.data.access_token; 
      
       
        const apiResponse = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        console.log("apiResponse -->",apiResponse)
      
       
        console.log("Api response Data", apiResponse.data);
      } catch (error) {
        
        if (error.response) {
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
        }
      }
    }); 
    
    //@HttpDelete
    it("Delete a specific record", async () => {
      const authUrl = "https://login.salesforce.com/services/oauth2/token";
      const recordId = 'a2IDp000000gjXGMAY'; //the id of the post purchase to be deleted 
      const deleteUrl = `https://veevqaone.my.salesforce.com/services/data/v50.0/sobjects/Auctifera__POS_Purchase__c/${recordId}`;

      const clientId = "3MVG93inh8Bkz5nZ1tqHi0_5ZF2VXf3c6Sg2eEbuBPXBR94_Q_zRZvJhRmhups22W2AugELZLGFlJ1JXC0VVg";
      const clientSecret = "CF3C5752E95B662EA9F02CB3AD8A6D05C2DDF1C2EFD96AED5D48A03BDFC249BD";
      const username = "dev@veevqaone.com";
      const password = "Veevart2024";

      const authParams = new URLSearchParams({
          grant_type: 'password',
          client_id: clientId,
          client_secret: clientSecret,
          username: username,
          password: password,
      });

      try {
          const authResponse = await axios.post(authUrl, authParams.toString(), {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
          });

          const accessToken = authResponse.data.access_token;

          const deleteResponse = await axios.delete(deleteUrl, {
              headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
              },
          });

          console.log("Delete response:", deleteResponse.status);

      } catch (error) {
          if (error.response) {
              console.error('Error data:', error.response.data);
              console.error('Error status:', error.response.status);
          } else {
              console.error('Error: ', error.message);
          }
      }
    });

    it("Test  functionality using SOSL to find records across multiple objects", async () => {
      const authUrl = "https://login.salesforce.com/services/oauth2/token";
      const soslQuery = 'FIND {provar} IN ALL FIELDS RETURNING Account(Id, Name), Contact(Id, Name)';
      const searchUrl = `https://veevqaone.my.salesforce.com/services/data/v50.0/search?q=${encodeURIComponent(soslQuery)}`;

      const clientId = "3MVG93inh8Bkz5nZ1tqHi0_5ZF2VXf3c6Sg2eEbuBPXBR94_Q_zRZvJhRmhups22W2AugELZLGFlJ1JXC0VVg";
      const clientSecret = "CF3C5752E95B662EA9F02CB3AD8A6D05C2DDF1C2EFD96AED5D48A03BDFC249BD";
      const username = "dev@veevqaone.com";
      const password = "Veevart2024";

      const authParams = new URLSearchParams({
          grant_type: 'password',
          client_id: clientId,
          client_secret: clientSecret,
          username: username,
          password: password,
      });

      try {
          const authResponse = await axios.post(authUrl, authParams.toString(), {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
          });

          const accessToken = authResponse.data.access_token;

          const searchResponse = await axios.get(searchUrl, {
              headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
              },
          });

          console.log("Search results:", searchResponse.data);

      } catch (error) {
          if (error.response) {
              console.error('Error data:', error.response.data);
              console.error('Error status:', error.response.status);
          } else {
              console.error('Error: ', error.message);
          }
      }
  });
})


