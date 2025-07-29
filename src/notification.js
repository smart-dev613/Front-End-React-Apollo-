

function fetchNotifications (currentUrl) {
    
   const endpoint = currentUrl

  //  const endpoint = 'https://graphql-dev.synkd.life'
    const query = `
        query getUserNotificationList {
            getUserNotificationList
        }
    `
    const options = {}
    self.postMessage({ type: 'FETCHING', fetching: true });
        fetch(endpoint, {
          method: 'POST',
          mode: 'cors',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
                query,
                variables: {}
            }),
          ...options
        })
        // @ts-ignore
        .then((response) => {
            self.postMessage({ type: 'FETCHING', fetching: false });
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            return response.json();
          })
          .then((response) => {

            // Send notifications data back to the main thread
            self.postMessage({ type: 'UPDATE', data: response.data });

          })
          // @ts-ignore
        .catch(err => {
          self.postMessage({ type: 'FETCHING',  fetching: false  });
        })
     
}

self.addEventListener('message', (e) => {

  

  if (e.data.type === 'FETCH_NOTIFICATIONS') {

    fetchNotifications(e.data.currentUrl)
    
    // Set up a recurring fetch every 1 minute (60,000 milliseconds)
    const fetchInterval = 60 * 1000; // 1 minute in milliseconds
    setInterval(() => {

        fetchNotifications(e.data.currentUrl);
        }, fetchInterval);
    }
    
    
  });


  //export {}
  