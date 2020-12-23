import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SendOTPRequest } from "../business-objects/SendOTPRequest";
import { SendOTPResponse } from "../business-objects/SendOTPResponse";
import { VerifyOTPRequest } from "../business-objects/VerifyOTPRequest";
import { VerifyOTPResponse } from "../business-objects/VerifyOTPResponse";
import { GetEmiratesList } from '../business-objects/GetEmiratesList';
import { GetFacilitiesListRequest } from '../business-objects/GetFacilitiesListRequest';
import { GetFacilitiesListResponse } from '../business-objects/GetFacilitiesListResponse';
import { AppointmentRequest } from "../business-objects/AppointmentRequest";
import { AppointmentResponse } from "../business-objects/AppointmentResponse";
import { SaveRegistrationRequest } from '../business-objects/SaveRegistrationRequest';
import { SaveRegistrationResponse } from '../business-objects/SaveRegistrationResponse';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(
    private httpClient: HttpClient 
    ) { }
  
  //#region send OTP api call

  /**
  * sendTOP
  * calls the send OPT api and returns the api response
  * @param {SendOTPRequest}
  * @returns {SendOTPResponse}
  */
  sendOTP(sendOTPApiUrl, 
    sendOTPRequest: SendOTPRequest): Observable<SendOTPResponse>{

    return this.httpClient.post<SendOTPResponse>(sendOTPApiUrl,
       sendOTPRequest) 
  }
  
   //#region verify OTP api call

   /**
  * verifyOTP
  * calls the verfy OTP api and returns the corresponding emirates details
  * @param {VerifyOTPRequest}
  * @returns {VerifyOTPResponse}
  */
  verifyOTP(verifyOTPApiUrl, 
    verifyOTPRequest: VerifyOTPRequest): Observable<VerifyOTPResponse>{

    return this.httpClient.post<VerifyOTPResponse>(verifyOTPApiUrl,
      verifyOTPRequest) 
  }

  //#region appointment api call
  getAppointmentSlots(appointmentApiUrl,
    appointmentRequest: AppointmentRequest): Observable<AppointmentResponse>{

    return this.httpClient.post<AppointmentResponse>(appointmentApiUrl,
      appointmentRequest);
  }
  //#endregion

  getCityList(getEmiratesList) {
    // now returns an Observable of Config
    return this.httpClient.get<GetEmiratesList[]>(getEmiratesList);
  }
  getFacilityList(getFacilitiesList,getFacilitiesRequestList:GetFacilitiesListRequest) {
    // now returns an Observable of Config
    return this.httpClient.get<GetFacilitiesListResponse[]>(getFacilitiesList+'/'+getFacilitiesRequestList.cityId
      );
  }

  
 saveRegistration(saveVaccination, 
  saveRegistrationRequest: SaveRegistrationRequest): Observable<SaveRegistrationResponse>{

  return this.httpClient.post<SaveRegistrationResponse>(saveVaccination,
    saveRegistrationRequest) 
}
}
