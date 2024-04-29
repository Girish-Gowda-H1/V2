import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import useFetchApi from '@hooks/useFetchApi';

const ConstantDataContext = createContext();

export const ConstantDataContextProvider = ({ children }) => {
  const [locationData, setLocationData] = useState(null);
  const [bikeData, setBikeData] = useState(null);
  const [mediaData, setMediaData] = useState(null);

  const { data: checklistFilterData, func: fetchChecklistFilters } = useFetchApi({ key: ['data_c_f'], url: 'checklist_filters' });

  const fetchChecklistFiltersData = useCallback(async () => {
    if (!locationData || !bikeData || !mediaData) {
      return await fetchChecklistFilters().then((res) => {
        const { status, bike_company, bike_model, cities, locations, states, type_of_media } = res?.data?.data || {};
        if (status) {
          setBikeData({ bike_company, bike_model });
          setMediaData({ type_of_media });
          setLocationData({ cities, locations, states });
        }
        return res;
      });
    }
  }, [bikeData, fetchChecklistFilters, locationData, mediaData]);

  useEffect(() => {
    if (!checklistFilterData && (!locationData || !bikeData || !mediaData)) {
      fetchChecklistFiltersData();
    }
  }, [bikeData, checklistFilterData, fetchChecklistFiltersData, locationData, mediaData]);

  const contextValues = useMemo(
    () => ({
      locationData,
      bikeData,
      mediaData,
      fetchChecklistFiltersData,
    }),
    [bikeData, locationData, mediaData, fetchChecklistFiltersData]
  );

  return <ConstantDataContext.Provider value={contextValues}>{children}</ConstantDataContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useConstantDataContext = () => {
  return useContext(ConstantDataContext);
};

export default ConstantDataContext;
