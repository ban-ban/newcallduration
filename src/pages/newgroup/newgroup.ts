import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { Storage } from '@ionic/storage';


import { GroupListService} from '../../providers/group-list/group-list' ;
import { Group } from '../../interfaces/group.interface';


@Component({
  selector: 'page-newgroup',
  templateUrl: 'newgroup.html',
})
export class NewGroupPage {
    groupName:any="";
    modifiedGroupName:any="";
    newMember:string;
    searchName:string;
    members:string[];
    phoneNumbers:string[];
    ids:string[];
    plus: boolean;
    readOnly: boolean;
    namereadOnly: boolean;
    myContacts: Contact[];
    

    constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,private contacts: Contacts, private viewCtrl: ViewController, private _groupList:GroupListService) {
      
      this.groupName="";
      this.modifiedGroupName=this.groupName;
      this.newMember="nouveau membre";
      this.searchName="";
      this.plus=false;
      this.readOnly=false;
      this.namereadOnly=false;
      this.myContacts=[];
      this.members=[]; 
      this.phoneNumbers=[];
      this.ids=[];
      
    }
   
    findContacts(){
        this.myContacts=[];
        this.contacts.find(['displayName'], {filter: this.searchName}).then((results)=>{
            this.myContacts=results;
            //console.log(results);
        });
    }
  

    selectContact(index: number){
      let phone:string=this.myContacts[index].phoneNumbers[0].value;
      let startnb:string=phone.slice(0,1);
      if (startnb=="0"){
        phone="+33"+phone.slice(1,phone.length);
      }
      this.plus=false;
      this.members.push(this.myContacts[index].displayName);
      
      this.phoneNumbers.push(phone);
      this.ids.push(this.myContacts[index].id);
      this.readOnly=true;
    }

      

    removeMember(index:number) {
      
      this.members.splice(index,1);
      this.phoneNumbers.splice(index,1);
      this.ids.splice(index,1);
    }

    addMember(){
      this.myContacts=[];
      this.searchName="";

      this.plus=true;
      this.readOnly=false;
      
    }

    createGroup(){
       
        
        if (this.members.length>0){
          let groupList : Group[]=[];
          groupList = this._groupList.addNewGroup(this.modifiedGroupName, this.members, this.phoneNumbers, this.ids);
         
          //let groupList : Group[] = this._groupList.returnGroupList();
          
         // alert ('groupList: name :'+ groupList[0].name);
          //recrée le groupe dans storage et option: enregistre la date de modifications
          this.storage.ready().then(()=>{
            this.storage.set("groupList",groupList).then( ()=> {
             // alert("storage groupList");
              this.viewCtrl.dismiss(false);
              });
            });
        }
        else {
          alert("at least one member");
        }
    }

    dismissModal(){
      this.viewCtrl.dismiss(true);
    }

}
