import axios from 'axios';

const getProspects = async (locations, keywords, positions) => {
  const body = {
    locations: locations,
    keywords: keywords,
    positions: positions,
  };

  return await axios.post(`${process.env.REACT_APP_FUNCTIONS_URL}/getProspects`, body);
};

export { getProspects };
