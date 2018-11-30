import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { GroupPage } from '../group/group' ;
import { NewGroupPage } from '../newgroup/newgroup' ;
import { Storage } from '@ionic/storage';
import { GroupListService } from '../../providers/group-list/group-list' ;
import { Group } from '../../interfaces/group.interface' ;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  nameLetters:string;
  groupList:Group[];
  myDate: Date ;
  
  startMonth: number; //ms from epoch
  oldStartMonth: number;
  oldMonth:number;  //ms from epoch
  oldDuration: boolean;
  oldYear:boolean;

  myMonth:number; //index to use with Months
  Months: String[]=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
   
 

  constructor(public navCtrl: NavController,public navParams: NavParams,private storage: Storage, private _groupList: GroupListService,private modalCtrl:ModalController) {
    this.storage.ready().then(()=>{
      this.storage.get("groupList").then((data)=>{
      console.log("constructor home, storage results");
      
      if (data!=null){
        console.log("data from storage:  ", data);
        //alert("constructor home : data from storage");
        this.groupList=data;
        this._groupList.loadGroupList(data); //fill _groupList
        this.setDates();
        this.oldDuration=true; //current month used for calculations
        this._groupList.loadDate(this.startMonth,this.oldStartMonth, this.oldDuration);
        this.refreshDuration();
      }
      else {
        console.log("data =null");
       // alert("constructor home: data storage null");
        this.groupList=[];
        this._groupList.loadGroupList([]); //initialize empty _groupList
        this.setDates();
        this.oldDuration=false; //current month used for calculations
        this._groupList.loadDate(this.startMonth,this.oldStartMonth, this.oldDuration);
        //this.storage.set("groupList",this.groupList);
      }
      })
      .catch ((err)=>{
      //no group yet created
      console.log("err =" + err);
      alert("constructor: err ");
     
      this.groupList=[];
      this.storage.set("groupList",this.groupList);
      this.setDates();
        this.oldDuration=false; //current month used for calculations
        this._groupList.loadDate(this.startMonth,this.oldStartMonth, this.oldDuration);
      });
    })
    .catch((err)=>{ console.log("storage not ready:" + err)});
   
   //this.setDates(); 
   // this._groupList.loadDate(this.startMonth);
  }

  setDates(){
    this.myDate= new Date();
   
    this.myMonth=this.myDate.getMonth();   //ex: 10 for November
    
    this.startMonth=this.myDate.setHours(0);
    this.startMonth=this.myDate.setMinutes(0);
    this.startMonth=this.myDate.setSeconds(0);
    this.startMonth=this.myDate.setMilliseconds(0);
    this.startMonth=this.myDate.setDate(1);  //ex: 1541026800000 for 01/11/2018 at 00:00
    
    //old Month
    
    this.oldMonth=this.myMonth-1;
    if (this.oldMonth<0) {
      this.oldMonth=11; //december
      this.oldStartMonth=this.myDate.setFullYear(this.myDate.getFullYear()-1); 
    }
    
    this.oldStartMonth=this.myDate.setMonth(this.oldMonth);
      

  }

  ionViewDidLoad (){
    

  }

 addGroup(){
   console.log("add Group clicked");
   let modal=this.modalCtrl.create(NewGroupPage);
   modal.present();
   modal.onDidDismiss((cancel:boolean)=>{
     if (cancel) {}
     else {
       this.groupList=this._groupList.returnGroupList();
     }

   });
 }

 removeGroup(index:number){
  this.groupList.splice(index,1);
  this._groupList.removeGroup(index);
     
        //recrée le groupe dans storage et option: enregistre la date de modifications
  this.storage.ready().then(()=>{
       this.storage.set("groupList",this.groupList).then( ()=> {
       });
  });
 }

openPage(index:number){
  let modal=this.modalCtrl.create(GroupPage, {'groupIndex': index});
  modal.present();
  modal.onDidDismiss((cancel:boolean)=>{
    if (cancel) {}
    else {
      this.groupList=this._groupList.returnGroupList();
      this.storage.ready().then(()=>{
        this.storage.set("groupList",this.groupList).then( ()=> {
          
          });
        });
    }

  });
}

refreshDuration(){
  this.groupList=this._groupList.refresh();
}

changeMonth(){
  this.oldDuration=!this.oldDuration;
  this._groupList.loadDate(this.startMonth,this.oldStartMonth, this.oldDuration);
  this.refreshDuration();
}

}
