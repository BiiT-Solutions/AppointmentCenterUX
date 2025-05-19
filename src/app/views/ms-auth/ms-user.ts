export class MsUser {
  id: string;
  displayName: string;
  givenName: string;
  surname: string;
  userPrincipalName: string;
  mail: string;
  mailNickname: string;
  userType: string;
  jobTitle: string;
  department: string;
  companyName: string;
  accountEnabled: boolean;

  constructor() {  }
  public static copy(from: MsUser, to: MsUser): void {
    to.id = from.id;
    to.displayName = from.displayName;
    to.givenName = from.givenName;
    to.surname = from.surname;
    to.userPrincipalName = from.userPrincipalName;
    to.mail = from.mail;
    to.mailNickname = from.mailNickname;
    to.userType = from.userType;
    to.jobTitle = from.jobTitle;
    to.department = from.department;
    to.companyName = from.companyName;
    to.accountEnabled = from.accountEnabled;
  }
  public static clone(from: MsUser): MsUser {
    const to: MsUser = new MsUser();
    MsUser.copy(from, to);
    return to;
  }
}
