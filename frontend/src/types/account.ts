export interface AccountDetailsDirectMessaging {
  accountId: number;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  type: string;
  phone: string;
  selected: boolean | false;
}

export interface Address {
  line: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
}

export interface Account {
  accountId: number;
  type: string;
  email: string;
  auth0Id: string;
  address: Address;
  phone: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
}

export interface UpdateAccountPayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    line?: string;
    city?: string;
    province?: string;
    country?: string;
    postalCode?: string;
  };
}
