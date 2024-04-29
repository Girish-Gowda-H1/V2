import { useMemo } from 'react';
import { useConstantDataContext } from '@context/ConstantDataContextProvider';

export const OptionUtils = () => {
  const { locationData, bikeData, mediaData } = useConstantDataContext();

  //   Options for Locations
  const stateOptions = useMemo(() => {
    if (locationData) {
      return locationData.states.map(({ state_id, state_name }) => {
        return { value: state_id, label: state_name };
      });
    }
    return [];
  }, [locationData]);

  const cityOptions = useMemo(() => {
    if (locationData) {
      return locationData.cities.map(({ city_id, city_name, state_id }) => {
        return { value: city_id, label: city_name, state_id };
      });
    }
    return [];
  }, [locationData]);

  const locationOptions = useMemo(() => {
    if (locationData) {
      return locationData.locations.map(({ location_id, location_name, city_id, state_id }) => {
        return { value: location_id, label: location_name, city_id, state_id };
      });
    }
    return [];
  }, [locationData]);

  //   Options for Bikes
  const bikeCompanyOptions = useMemo(() => {
    if (bikeData) {
      return bikeData.bike_company.map(({ make_id, make }) => {
        return { value: make_id, label: make };
      });
    }
    return [];
  }, [bikeData]);

  const bikeModelOptions = useMemo(() => {
    if (bikeData) {
      return bikeData.bike_model.map(({ model_id, make_id, model_name }) => {
        return { value: model_id, label: model_name, make_id };
      });
    }
    return [];
  }, [bikeData]);

  //   Options for Media
  const mediaTypeOptions = useMemo(() => {
    if (mediaData) {
      return mediaData.type_of_media.map(({ id, value }) => {
        return { value: id, label: value };
      });
    }
    return [];
  }, [mediaData]);

  return { stateOptions, cityOptions, locationOptions, bikeCompanyOptions, bikeModelOptions, mediaTypeOptions };
};
