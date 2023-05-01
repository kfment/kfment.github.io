const StarblastAPI = {
    getSystemInfo: async function(id) {
        id = String(id);
        console.log(`https://api.pixelmelt.dev/status/${id}`);
        let response;
        if (id.length < 5) {
            response = await axios.get(`https://api.pixelmelt.dev/status/${id}`);
        } else {
            response = await axios.get(`https://api.pixelmelt.dev/status/${id}`);
        }
        return response.data;
    }
}