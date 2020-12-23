import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from "../../environments/environment";
import { RegistrationService } from "../services/registration.service";
import { SendOTPRequest } from "../business-objects/SendOTPRequest";
import { SendOTPResponse } from "../business-objects/SendOTPResponse";
import { VerifyOTPRequest } from "../business-objects/VerifyOTPRequest";
import { VerifyOTPResponse } from "../business-objects/VerifyOTPResponse";
import { GetEmiratesList } from "../business-objects/GetEmiratesList";
import { constants } from "../shared/constants";

import { GetFacilitiesListRequest } from "../business-objects/GetFacilitiesListRequest";
import { GetFacilitiesListResponse } from "../business-objects/GetFacilitiesListResponse";

import { AppointmentRequest } from '../business-objects/AppointmentRequest';
import { AppointmentResponse } from '../business-objects/AppointmentResponse';
import { SaveRegistrationRequest } from '../business-objects/SaveRegistrationRequest';
import { SaveRegistrationResponse } from '../business-objects/SaveRegistrationResponse';

import { GetQuestionariesRequest } from '../business-objects/QuestionariesRequest';


import { MouseEvent } from '@agm/core';
import { MapsAPILoader,AgmMarker } from '@agm/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public envConstants= environment;
  public showVerifyOTPField: boolean;
  public showEmiratesIdDetails: boolean;
  public showSuccessAlert: boolean;
  public showErrorAlert: boolean;
  public showAppointmentAlert:boolean;
  public errorAppointmentText;
  public errorMessageText;
  public successMessageText;
  public locationName;
  public slots: any;
  public City: GetEmiratesList;
  public listCity: GetEmiratesList[]; 
  public listCityDuplicate: GetEmiratesList[];
  public listFacility: GetFacilitiesListResponse;
  public listFacilities: GetFacilitiesListResponse[];
  public selectedSlotId: any;
  public navReg: any;
  public navQues: any;
  public navFac: any;
  public navApp: any;
  public navCons: any;
  public navConf: any;
  public disReg: boolean = true;
  public disQues: boolean = true;
  public disFac: boolean = true;
  public disApp: boolean = true;
  public disCons: boolean = true;
  public disConf: boolean = true;
  public genderVal:boolean=true;

  public ConsentChk:boolean;
  public applicationID:string='';
  
  public otpNext: boolean=false;
  public otpFacility:boolean=false;
  public nextSlot:boolean=false;
  public nextConsent:boolean=false;

  clsReg; clsQues; clsFac; clsApp; clsCons; clsConf;
  tabReg; tabQues; tabFac; tabApp; tabCons; tabConf;
  public sendOTPRequest: SendOTPRequest ={
    emailId: '',
    mobileNumber: '',
    emiratesId: ''
  }
  public verifyOTPRequest: VerifyOTPRequest = {
    otp: '',
    uniqueKey: '',
    eid: ''
  }
  public sendOTPResponse: SendOTPResponse = {
    trnKey: '',
    isSuccesss: false,
    hasOTPSent: false,
    firstDoseAdministered: false
  }
  public verifyOTPResponse: VerifyOTPResponse = {
    isSuccess: false,
    isValid: false,
    name: '',
    dob: '',
    gender: '',
    age: '',
    nationality: '',
    preferredLanguage: ''
  }

  public getEmiratesListResponse: GetEmiratesList=
  {
    emirateID:'',
    emirateName:''
  }

  public getFacilitiesRequestList: GetFacilitiesListRequest=
  {
    cityId:''
  }
  public appointmentRequest: AppointmentRequest = {
    locationID: 0,
    appointmentDate: ''
  }
  public appointmentResponse: AppointmentResponse = {
    slotID: 0,
    slotStartTime: '',
    slotEndTime: '',
    isBooked: 0

  }

  public questionariesRequest:GetQuestionariesRequest=
  {
    chronicDisease:false,
    coronarySyndromeStroke:false,
    covid19AntiBodies:false,
    covid19Vaccinated:false,
    hadCovid19:false,
    isPregnantOrPlanning:false,
    majorOperationSurgery:false
  }
  public saveRegistrationResponse: SaveRegistrationResponse = {
    isSuccess: false,
    applicationNo: '',
    message: ''
 }

  public appConstants = constants;
  registerForm: FormGroup;
  otpForm: FormGroup;
  submitted = false;
submittedOTP=false;
  public appointmentResult: any = [];
  
  title = 'Vaccination portal';
  lat = 24.4539;
  long = 54.3773;

  constructor(
    private registationService: RegistrationService,
    private formBuilder: FormBuilder
    
    ) { }

//#region pageload
  ngOnInit(): void {
    this.navLinks("Reg");
    this.appointmentRequest.appointmentDate = this.getCurrentDate(); 
    this.getCity();
    this.registerForm = this.formBuilder.group({
      emiratesId: ['', Validators.required],
      mobileNumber: ['', Validators.required]
  });
  this.otpForm = this.formBuilder.group({
    otp: ['', Validators.required]
});
  }
  //gets the current date
  getCurrentDate(): string {
    let currentDate = new Date().getFullYear() +  '-' + (new Date().getMonth() + 1) + '-'+ new Date().getDate();
    return currentDate;
  }
  //#endreagion
   //#region verify OTP api integration
   getCity(){
 
    let apiUrl = this.envConstants.apiUrl + this.envConstants.getEmiratesList;
    let errorMessages = this.appConstants.errorMessages;
    console.log(`Calling the ${apiUrl} api...`);
    //api call
    this.registationService.getCityList(apiUrl)
    .subscribe((CityList: GetEmiratesList[]) => {
      this.listCity = CityList;
      this.listCityDuplicate=this.listCity;
      // todo: determine the selected configuration

  });
  }
 
  //#region send OTP api integration

  sendOTP(){

    this.submitted = true;
    this.otpNext=false;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    this.showSuccessAlert = false;
    this.showErrorAlert = false;

    let apiUrl = this.envConstants.apiUrl + this.envConstants.sendOTPApiUrl;
    let errorMessages = this.appConstants.errorMessages;
    console.log(`Calling the ${apiUrl} api... with payload`);
    sessionStorage.setItem("eid", this.sendOTPRequest.emiratesId);
    //api call
    this.registationService.sendOTP(apiUrl, this.sendOTPRequest)
    .subscribe(otpResponse => {  
      console.log(`${apiUrl} api success response received`);
      this.sendOTPResponse = otpResponse; 

      //check is otp response has data?
      if(!this.sendOTPResponse){       
        console.error("No data has found in OTP success response. Prompt user with techincal error message");
        this.errorMessageText = errorMessages.endUserTechnicalError;
        this.showErrorAlert = true;
        return;
      }

      //do not proceed the registraton if user has already completed first dose
      if(this.sendOTPResponse.firstDoseAdministered){
        console.error(errorMessages.firstDoseCompleted);
        this.errorMessageText = errorMessages.firstDoseCompleted;
        this.showErrorAlert = true;
        return;
      } 

      //verify has OTP sent successfully?
      if(this.sendOTPResponse.hasOTPSent){        
        console.info("OTP has been sent successfully. Prompt the user to OTP sent success message");
        sessionStorage.setItem("trnKey", this.sendOTPResponse.trnKey);
        this.showSuccessAlert = true;
        this.successMessageText = this.appConstants.otpSuccessMessage
         this.showVerifyOTPField = true;
         return ;
      }
      
    }, (error) => {

      console.error("An error has occurred in sendOPT api integration: ", error);
      this.errorMessageText = errorMessages.endUserTechnicalError;
      this.showErrorAlert = true;
      return 
    }); 
  }

  //#endregion

   //#region verify OTP api integration
   verifyOTP(){
    this.submittedOTP = true;
    if (this.otpForm.invalid) {
      return;
  }
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.submittedOTP = true;
    let apiUrl = this.envConstants.apiUrl + this.envConstants.verifyOTPApiUrl;
    let errorMessages = this.appConstants.errorMessages;
    let trnkey = sessionStorage.getItem("trnKey");
    let eid = sessionStorage.getItem("eid");
    this.verifyOTPRequest.uniqueKey = trnkey;
    this.verifyOTPRequest.eid = eid;
    console.log(`Calling the ${apiUrl} api... with payload`);
    //api call
    this.registationService.verifyOTP(apiUrl, this.verifyOTPRequest)
    .subscribe(otpResponse => {  
      console.log(`${apiUrl} api success response received`);
      this.verifyOTPResponse = otpResponse; 
    
      //check is verify otp response has data?
      if(!this.verifyOTPResponse){     
        console.error("No data has found in verify OTP success response. Prompt user with techincal error message");
        this.errorMessageText = errorMessages.endUserTechnicalError;
        this.showErrorAlert = true;
          return;
      }
      
      //verify has OTP successfully verified and returns the emirates details
      console.log(`verifying... is OTP has successfully verified and returns the emirates id details...`);
      if(!this.verifyOTPResponse.isSuccess){ 
        console.error("Unablet to verify OTP and fetching emirates id details");
        this.errorMessageText = errorMessages.endUserTechnicalError;
        this.showErrorAlert = true;
        return;
      }
      //invalid OTP and unable to fecthc emirares id details.
      if(!this.verifyOTPResponse.isValid){
          this.showErrorAlert = true;
          this.errorMessageText = "Invalid OTP";
            console.log("Invalid OTP  and unable to fetch the emirates id details: ", this.verifyOTPResponse);           
            return ;
      }

      //OTP hsa been verified successfully and retrieved the emirates id details
      if(this.verifyOTPResponse.gender=='Male')
      {
          this.genderVal=false;
      }
      this.showVerifyOTPField = false;
      console.log("OTP hsa been verified successfully and retrieved the emirates id details: ", this.verifyOTPResponse);
      this.showEmiratesIdDetails  = true;
      this.otpNext=true;
      return ;
      
    }, (error) => { 
      console.error("An error has occurred in verifyOTP api integration: ", error);
      this.errorMessageText = errorMessages.endUserTechnicalError;
      this.showErrorAlert = true;
      return;
    }); 
  }


  selectCityFacilities(filterVal: any) {
    this.otpFacility=false;
    let apiUrl = this.envConstants.apiUrl + this.envConstants.getFacilitiesList;
    let errorMessages = this.appConstants.errorMessages;
    this.getFacilitiesRequestList.cityId=filterVal;
    console.log(`Calling the ${apiUrl} api...`);
    //api call
    this.registationService.getFacilityList(apiUrl,this.getFacilitiesRequestList)
    .subscribe((listFacility: GetFacilitiesListResponse[]) => {
      this.listFacilities=(listFacility);

  });
}

eventCheck(event: any){
  console.log(event);
  this.long = Number(event.locationLongitude);
  this.lat = Number(event.locationLatitude);
  this.otpFacility=true;
  sessionStorage.setItem("facilityId", event.locationID)
  sessionStorage.setItem("facilityName", event.locationDesc)
}

get f() { return this.registerForm.controls; }
get r() { return this.otpForm.controls; }

onSubmit() {
  this.submitted = true;

  // stop here if form is invalid
  if (this.registerForm.invalid) {
      return;
  }



}

onSubmitOtp() {
    this.submittedOTP = true;

    // stop here if form is invalid
    if (this.otpForm.invalid) {
      return;
  }

}
//#region get appointment slots
 slotVlaue:any;
getAppopintmentSlots(){
  let locationID = sessionStorage.getItem("facilityId");   
  this.showSuccessAlert = false;
  this.showErrorAlert = false;
  let errorMessages = this.appConstants.errorMessages;

  let apiUrl = this.envConstants.apiUrl + this.envConstants.getAppointmentSlots;
  this.appointmentRequest.locationID = locationID
  console.log(`Calling the ${apiUrl} api... with payload: `, this.appointmentRequest);
  this.registationService.getAppointmentSlots(apiUrl,
    this.appointmentRequest)
    .subscribe((response) => {
      console.log(`${apiUrl} api success response received: `, response);

      //convert response objct       
      let appointmetns: AppointmentResponse[] = [response];
      this.appointmentResult = [];
      for (let index = 0; index < appointmetns.length; index++) {
          this.slotVlaue = appointmetns[index];
          for (let index = 0; index < this.slotVlaue.length; index++) {
              const value = this.slotVlaue[index];
              //time conversion
              let times = value.slotStartTime.split(':');
              value.slotStartTime = times[0] + ':' + times[1];
              this.appointmentResult.push(value);
                  
                }       
      }
      console.log("appoint response object after changing the property values: ", this.appointmentResult);   
    },
    (error) =>{
      console.error("An error has occurred in get appointments api integration: ", error);
      this.errorMessageText = errorMessages.endUserTechnicalError;
      this.showErrorAlert = true;
      return;
    });
}

//display appointment slots
displayAppointmentSlots()
{     
   this.locationName = sessionStorage.getItem("facilityName");
   this.navNext('App');
   this.nextSlot=false;
   this.selectedSlotId=0;
   //calls the appointment api call 
  return this.getAppopintmentSlots();
}
//gets the selected slots
   
selectedSlot(event){
  //sets the color for selected slot
  if(this.selectedSlotId
     && (this.selectedSlotId !== event.target.defaultValue)){
      this.errorAppointmentText ="Cannot select more than one slot. please unselect current slot and choose another!" ;
      this.showAppointmentAlert = true;
      return;
   //return alert("Cannot be selected more than one. Please unselect and select one.");
   
 }
  event.target.labels[0].style.background = event.target.checked ? "lightblue" : '';  
  this.selectedSlotId = event.target.checked ? event.target.defaultValue : '';
  sessionStorage.setItem("selectedSlotId", this.selectedSlotId);  
  event.target.checked?this.nextSlot=true:this.nextSlot=false;
  //TODO: TIP: add validation check on next button action
  // if(!selectedSlotId){
  //   alert("test");
  // }
}

placeMarker($event){
  console.log($event.coords.lat);
  console.log($event.coords.lng);
  let longitude=Number($event.coords.lng);
  if (longitude >= 55.4 && longitude<=55.5) {
    // something
    this.selectCityFacilities('3');
    this.lat = 25.3463;
    this.long = 55.4209;
    this.listCity=this.listCityDuplicate;
  }
  if (longitude >= 55.2 && longitude<=55.3) {
    // something
    this.selectCityFacilities('2');
    this.lat = 25.2048;
    this.long = 55.2708;
    this.listCity=this.listCityDuplicate;
  }
  if (longitude >= 54.3 && longitude<=54.4) {
    // something
    this.selectCityFacilities('1');
    this.lat = 24.4539;
    this.long = 54.3773;
    this.listCity=this.listCityDuplicate;
  }
}

//#endregion

//#regin Save registration
saveRegistration(){
  let requstObject: SaveRegistrationRequest ={
    fullName : this.verifyOTPResponse.name,
    dob : this.verifyOTPResponse.dob,
    gender : this.verifyOTPResponse.gender,
    mobileNumber : this.sendOTPRequest.mobileNumber,
    eid : this.sendOTPRequest.emiratesId,
    passportNumber : '',// N/A in response
    nationality : this.verifyOTPResponse.nationality,
    residentEmirate : '', //N,A in response
    email : this.sendOTPRequest.emailId,
    prefLanguage : this.verifyOTPResponse.preferredLanguage,
    uaeAddress : '',
    hadCovid19 : this.questionariesRequest.hadCovid19,
    covid19AntiBodies : this.questionariesRequest.covid19AntiBodies, 
    covid19Vaccinated : this.questionariesRequest.covid19Vaccinated,
    chronicDisease : this.questionariesRequest.chronicDisease,
    majorOperationSurgery : this.questionariesRequest.majorOperationSurgery,
    coronarySyndromeStroke : this.questionariesRequest.coronarySyndromeStroke,
    isPregnantOrPlanning : this.questionariesRequest.isPregnantOrPlanning,
    firstDoseLocId : sessionStorage.getItem("facilityId"),
    firstDoseDate : this.appointmentRequest.appointmentDate,
    firstDoseApptSlotID : sessionStorage.getItem("selectedSlotId"),
    vaccineConsent : true
    
  }
  console.log(requstObject);
  let apiUrl = this.envConstants.apiUrl + this.envConstants.saveVaccination;
  let errorMessages = this.appConstants.errorMessages;
  console.log(`Calling the ${apiUrl} api... with payload: ${requstObject} ` );
  //api call
  this.registationService.saveRegistration(apiUrl, requstObject)
  .subscribe((saveRegistrationResponse) => {  
    console.log(`${apiUrl} api success response received: ${saveRegistrationResponse}`);  
    this.applicationID=saveRegistrationResponse.applicationNo;
    this.navNext('Conf'); 
    
},
 (error) => {

  console.error("An error has occurred in Save Registration api integration: ", error);
  this.errorMessageText = errorMessages.endUserTechnicalError;
  this.showErrorAlert = true;
  return 
}); 


}
//#endregion
public onConsent(value:boolean){
  this.nextConsent = value;
}
 //nav links
 navLinks(navLink){
  let navClass = 'nav-link title-background';
  let active = navClass + ' active';
  let tabClass = 'container tab-pane'
  let tabActive = tabClass + ' active';
  let color ='#fff';
  this.clsReg=''; this.clsQues=''; this.clsFac=''; this.clsApp =''; this.clsCons=''; this.clsConf='';
  this.navReg = navClass; this.navQues = navClass; this.navFac=navClass; this.navApp=navClass; this.navCons=navClass; this.navConf=navClass;
  this.tabReg = tabClass; this.tabQues = tabClass; this.tabFac=tabClass; this.tabApp=tabClass; this.tabCons = tabClass; this.tabConf=tabClass;
  
  switch (navLink) {
    case "Reg":
      this.navReg = active;
      this.disReg = false;
      this.clsReg = color;
      this.tabReg = tabActive;
      
      break;
      case "Ques":
      
        this.navQues = active;
        this.disQues =  false;
        this.clsQues = color;
        this.tabQues = tabActive;
      break;
      case "Fac":
        this.navFac = active;
        this.disFac = false;
        this.clsFac = color;
        this.tabFac = tabActive;
      break;
      case "App":
        this.navApp = active;
        this.disApp = false;
        this.clsApp = color;
        this.tabApp = tabActive;
      break;
      case "Cons":
        this.navCons = active;
        this.disCons = false;
        this.clsCons = color;
        this.tabCons = tabActive;
      break;
      case "Conf":
        this.navConf = active;
        this.disConf = false;
        this.clsConf = color;
        this.tabConf = tabActive;
      break;
    default:
      this.navReg = active;
      this.disReg = false;
      this.clsReg = color;
      this.tabReg = tabActive;
      break;
  }
}
navNext(name, nav=""){
  switch (name) {
    case "Reg":
     this.navLinks(name);        
      break;
      case "Ques":
        this.navLinks(name);  
      break;
      case "Fac":
        this.navLinks(name);  
      break;
      case "App":
        this.navLinks(name);  
      break;
      case "Cons":
        this.navLinks(name);  
      break;
      case "Conf":
        this.navLinks(name);  
      break;
    default:
      break;
  }
}
navPrevious(name){
 
  switch (name) {
    case "Reg":
      this.navLinks(name);        
      break;
      case "Ques":
        this.navLinks(name);      
      break;
      case "Fac":       
        this.navLinks(name);   
      break;
      case "App":        
        this.navLinks(name);   
      break;
    default:
      break;
  }
}
 
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
 }