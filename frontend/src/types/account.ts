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

export type AccountType = "ADMIN" | "COACH" | "PLAYER" | "GENERAL";

export interface Account {
  accountId: number;
  type: AccountType;
  email: string;
  auth0Id: string;
  address: Address;
  phone: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
}

export interface AccountPermissions {
  accountId: number;
  email: string;
  firstName: string;
  lastName: string;
  type: string;
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
