import { LatLngLiteral } from "@googlemaps/google-maps-services-js";
import { UpsResponse } from './ups-types';

export type ValueAndUnit = {
  value: number,
  unit: string
};
export type AddressObject = {
  country?: string,
  address?: string,
  city?: string,
  state_province?: string,
  zip_code?: string,
};
export type Address = string | AddressObject;
export type AddressAndCoordinates = AddressObject & {
  coords?: LatLngLiteral
};
export type ShippingMode = 'air' | 'ground' | 'sea' | 'rail';
export type Distance = {
  origin: AddressAndCoordinates,
  destination: AddressAndCoordinates,
  value: number,
  unit: string,
  mode: ShippingMode
};
export type Flight = {
  flight_number: string,
  number_of_passengers?: number,
  carrier?: string,
  class?: string,
};
export type Shipment = {
  carrier: string,
  tracking: string,
  mode?: ShippingMode
  weight?: number,
  weight_uom?: string,
};
export type Path = {
  from: Address,
  to: Address,
};
type ActivityBase = Path & {
  id: string,
  type: 'shipment' | 'flight',
};
export type ShipmentActivity = ActivityBase & Shipment;
export type FlightActivity = ActivityBase & Flight;
export type Activity = ShipmentActivity | FlightActivity;
export type ActivityResult = {
  distance?: Distance,
  weight?: ValueAndUnit,
  emissions?: ValueAndUnit,
  details?: any
}
export type ProcessedActivity = {
  activity: Activity,
  result?: ActivityResult,
  error?: string
}

export type Output = {
  ups?: UpsResponse,
  from?: Address,
  to?: Address,
  weight?: ValueAndUnit,
  distance?: Distance,
  emissions?: ValueAndUnit,
};


export function is_shipment_activity(a: Activity): a is ShipmentActivity {
  return a.type === 'shipment';
}

export function is_shipment_flight(a: Activity): a is ShipmentActivity {
  return a.type === 'flight';
}

export function is_address_object(a: Address): a is AddressObject {
  return typeof a !== 'string';
}



